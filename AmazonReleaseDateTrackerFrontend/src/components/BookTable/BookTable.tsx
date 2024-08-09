import React, { useEffect, useContext, useState } from "react";
import "./BookTable.css";
import Book from "../../data/book";
import BookTableRow from "./BookTableRow/BookTableRow";
import BookListManagerContext, {
  BookListManagerProps,
} from "../../services/bookListManager";

function createTableRow(book: Book) {}

const BookTable = () => {
  console.log("render");
  const elements: any[] = [];

  const bookListManagerContext = useContext<BookListManagerProps | null>(
    BookListManagerContext
  );

  const startBooks: Book[] = [];
  const [state, setBookList] = useState({ bookList: startBooks });

  const makeRequestForBooks = () => {
    var bookListPromise = bookListManagerContext?.retrieveAllBooks();

    bookListPromise?.then((books: Book[]) => {
      console.log("Books", books);
      if (state.bookList != books) {setBookList({ bookList: books });}
    }).catch((err) => {
      if (err.message !== "Unauthorized") {
        console.error(err);
      }
    });
  }

  useEffect(() => { // Function gets run ony once because [] dosn't change
    makeRequestForBooks();

    return ()=>{/* cleanup */};
  }, []);

  if (state.bookList != null) {
    state.bookList.forEach((book: Book) => {
      elements.push(
        <BookTableRow
          key={book.id}
          book={book}
          deleteHandler={(bookToDelete) => {
            console.log("delete: ", bookToDelete);
            var remainingBooks;
            
            remainingBooks = bookListManagerContext?.deleteBook(
              state.bookList,
              bookToDelete
            );
            if (remainingBooks != null) {
              setBookList({ bookList: remainingBooks });
            }
          }}
        />
      );
    });
  }

  return (
    <div className="BookTable">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Releasedate
              </th>
              <th scope="col" className="px-6 py-3">
                Delete
              </th>
            </tr>
          </thead>
          <tbody>{elements}</tbody>
        </table>
      </div>
    </div>
  );
  
};

export default BookTable;
