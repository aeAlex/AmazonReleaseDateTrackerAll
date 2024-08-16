import Book from "../data/book";
import React from "react";
import Config from "../config.json";

export interface BookListManagerProps {
  retrieveAllBooks(): Promise<Book[]>;
  deleteBook(bookList: Book[], bookToDelete: Book): Promise<Book[]>;
  register(username: string, password: string, rp_password: string, 
    on_created: () => void, 
    on_problem: (status: number, msg: string) => void
  ): Promise<boolean>;
  login(username: string, password: string): Promise<boolean>;
  logout(): void;
}

class MockBookListManager implements BookListManagerProps {
  onUnauthorized: () => void;
  constructor(onUnauthorized: () => void) {
    this.onUnauthorized = onUnauthorized;
  }

  retrieveAllBooks(): Promise<Book[]> {
    console.log("gettin stuff");
    const bookList: Book[] = [];
    bookList.splice(0);
    bookList.push(
      new Book(
        1,
        "Primal Hunter 7",
        "https://www.amazon.de/Primal-Hunter-LitRPG-Adventure-English-ebook/dp/B0C6W5XQNW/ref=d_wsixn_inc_v1_sccl_1_2/259-5959141-3780043?pd_rd_w=6byID&content-id=amzn1.sym.d47f9628-36dd-4b9a-8b52-87d849a54a0e&pf_rd_p=d47f9628-36dd-4b9a-8b52-87d849a54a0e&pf_rd_r=HWKAHZG5ZGDHDX8V6NP8&pd_rd_wg=6bSW5&pd_rd_r=3846e4eb-73e2-423b-974f-849fdbb585ac&pd_rd_i=B0C6W5XQNW&psc=1",
        "6. Dezember 2022"
      ),
      new Book(
        2,
        "Randidly Ghosthound",
        "https://www.amazon.de/dp/B0BZRRCKDN/ref=sspa_dk_detail_1?psc=1&pd_rd_i=B0BZRRCKDN&pd_rd_w=RxGTv&content-id=amzn1.sym.ae2317a0-2175-4285-af64-66539858231f&pf_rd_p=ae2317a0-2175-4285-af64-66539858231f&pf_rd_r=XKG1FK6X966WW7Y9P391&pd_rd_wg=JQRZ8&pd_rd_r=abbe480c-edd5-49c3-b78a-4bc8dbc3bb1c&sp_csd=d2lkZ2V0TmFtZT1zcF9kZXRhaWw",
        "1. August 2023"
      )
    );
    return new Promise<Book[]>((resolve) => resolve(bookList));
  }

  deleteBook(bookList: Book[], bookToDelete: Book): Promise<Book[]> {
    return new Promise<Book[]>((resolve) => bookList.filter((book) => book.id !== bookToDelete.id));
  }

  register(username: string, password: string, rp_password: string, on_created: () => void, on_problem: (status: number, msg: string) => void): Promise<boolean> {
    return Promise.resolve(true);
  }

  login(username: string, password: string): Promise<boolean> {
    return Promise.resolve(true);
  }

  logout(): void {
    console.log("logging out");
  }
}

interface ApiBook {
  ID_book: number;
  Name: string;
  Url: string;
  ReleasedateString: string;
  ID_user: number;
}

function mapApiBookToBook(apiBook: ApiBook): Book {
  return new Book(
    apiBook.ID_book,
    apiBook.Name.trim(),             // Trimming the whitespace from the name
    apiBook.Url.trim(),              // Trimming the whitespace from the URL
    apiBook.ReleasedateString.trim() // Trimming the whitespace from the release date
  );
}

class BookListManager implements BookListManagerProps {
  URL_PREFIX = Config.server.url;
  onUnauthorized: () => void;

  constructor(onUnauthorized: () => void) {
    this.onUnauthorized = onUnauthorized;
  }

  retrieveAllBooks(): Promise<Book[]> {
    const url = this.URL_PREFIX + "booklist";
    console.log("fetching books from", url);
    return fetch(url, {
      method: "GET",
      credentials: "include",  // Include cookies in the request
      headers: {
        "Content-Type": "application/json",
        // Todo remove these headers, and handle no change status 304
        "Cache-Control": "no-cache", // Prevent caching
        "Pragma": "no-cache",        // HTTP 1.0 backward compatibility
        "Expires": "0",              // Expire immediately
      }
    })
      .then((response) => {
        console.log(response);
        if (response.status === 401) {
          this.onUnauthorized();  // Trigger the callback
          throw new Error("Unauthorized");
        }
        if (!response.ok) {
          console.log("Error other than 401!");
          throw new Error(response.statusText);
        }
        return response.json();
      })
      .then((data) => {
        return data.books.map(mapApiBookToBook);
      });
  }

  async deleteBook(bookList: Book[], bookToDelete: Book): Promise<Book[]> {
    const url = this.URL_PREFIX + "untrackBook";
    
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",  // Include cookies in the request
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_book: bookToDelete.id,
      }),
    });
    console.log(response);
    if (response.ok) {
      // Introduce a short delay to allow the server to process the deletion
      await new Promise(resolve => setTimeout(resolve, 200)); 
      return this.retrieveAllBooks();
    } else {
      throw new Error(response.statusText);
    }
    
  }

  async register(username: string, password: string, rp_password: string, on_created: () => void, on_problem: (status: number, msg: string) => void): Promise<boolean> {
    try {
      const url = this.URL_PREFIX + "register";
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password: password,
          passwordRP: rp_password,  // Send repeated password field
        }),
      });
      console.log(response);
      if (response.status === 201) {
        // Registration was successful
        on_created();
        return true;
      } else {
        // Handle different response statuses
        on_problem(response.status, response.statusText);
        return false;
      }
    } catch (error) {
      console.error("Failed to register:", error);
      return false;
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    try {
      const url = this.URL_PREFIX + "login";
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",  // Include cookies in the request
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      });
      console.log(response);
      if (response.status === 201) {
        // Registration was successful
        return true;
      } else {
        // Handle different response statuses
        return false;
      }
    } catch (error) {
      console.error("Failed to login:", error);
      return false;
    }
  }

  logout(): void {
    const url = this.URL_PREFIX + "logout";
    console.log("fetching books from", url);
    fetch(url, {
      method: "GET",
      credentials: "include",  // Include cookies in the request
    }).then((response) => {
      console.log(response);
    });
  }

}

const BookListManagerContext = React.createContext<BookListManagerProps | null>(
  null
);

export default BookListManagerContext;
export { BookListManager as BookListManager };
