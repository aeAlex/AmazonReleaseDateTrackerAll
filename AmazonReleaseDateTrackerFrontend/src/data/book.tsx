class Book {
  // Fields
  id: number;
  name: string;
  url: string;
  releaseDate: string;

  constructor(id: number, name: string, url: string, releaseDate: string) {
    this.id = id;
    this.name = name;
    this.url = url;
    this.releaseDate = releaseDate;
  }
}
export default Book;
