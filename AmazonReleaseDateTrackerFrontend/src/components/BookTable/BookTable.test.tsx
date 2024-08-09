import React, { useContext } from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import BookTable from "./BookTable";
import BookListManagerContext, {
  BookListManagerProps,
} from "../../services/bookListManager";

function App() {
  const bookListManagerContext = useContext<BookListManagerProps | null>(
    BookListManagerContext
  );

  describe("<BookTable />", () => {
    test("it should mount", () => {
      render(<BookTable />);

      const bookTable = screen.getByTestId("BookTable");

      expect(bookTable).toBeInTheDocument();
    });
  });
}
