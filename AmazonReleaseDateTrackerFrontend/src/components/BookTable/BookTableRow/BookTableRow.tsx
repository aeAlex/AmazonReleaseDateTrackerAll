import React from "react";
import Book from "../../../data/book";

interface BookTableRowProps {
  book: Book;
  deleteHandler: (book: Book) => void;
}

const BookTableRow = ({ book, deleteHandler }: BookTableRowProps) => {
  const deleteBook = (book: Book) => {
    console.log("delete: ", book.name);
    deleteHandler(book);
  };

  return (
    <tr className="bg-white border-b dark:bg-gray-900 dark:border-gray-700">
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        <a
          href={book.url}
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
        >
          {book.name}
        </a>
      </th>
      <td className="px-6 py-4">{book.releaseDate}</td>
      <td className="px-6 py-4">
        <button
          className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
          onClick={() => {
            deleteBook(book);
          }}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default BookTableRow;
