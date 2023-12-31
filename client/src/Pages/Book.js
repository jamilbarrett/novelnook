import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Book(props) {
  const [data, setData] = useState({ book: {} });
  const { id } = useParams();
  const navigate = useNavigate();
  const [similarBooks, setSimilarBooks] = useState([]);
  useEffect(() => {
    axios
      .get(`https://www.googleapis.com/books/v1/volumes/${id}`)
      .then((result) => {
        setData({ book: result.data });
        const author = result.data.volumeInfo.authors[0];
        if (author) {
          axios
            .get(`https://www.googleapis.com/books/v1/volumes?q=inauthor:${author}&maxResults=5`)
            .then((response) => {
              setSimilarBooks(response.data.items);
            })
            .catch((error) => {
              console.error("Error fetching similar books:", error);
            });
        }

      });
  }, []);

  async function addToFavorites() {
    const {
      data: { user },
    } = await axios.post("/api/favorites", {
      bookId: data.book.id,
      image: data.book.volumeInfo.imageLinks.thumbnail,
      title: data.book.volumeInfo.title,
      user: props.state.user._id,
    });
    const found = user.favorites.find((element) => element.bookId === id);
    console.log(user.favorites, id, found);

    props.setState({ ...props.state, user });
  }
  async function deleteFromFavorites(bookId) {
    try {
      const {
        data: { user },
      } = await axios.delete(`/api/favorites/${bookId}`);

      props.setState({
        ...props.state,
        user,
      });
    } catch (error) {
      console.error("Error deleting favorite:", error);
    }
  }

  return (
    <div className="container my-24 mx-auto md:px-6">
      <section className="mb-32">
        <div className="block rounded-lg bg-white  dark:bg-neutral-700">
          <div className="flex flex-wrap items-center">
            <div className="hidden shrink-0 grow-0 basis-auto lg:flex lg:w-6/12 xl:w-4/12">
              <img
                src={data.book.volumeInfo?.imageLinks.thumbnail}
                alt="book cover"
                className="w-full rounded-t-lg lg:rounded-tr-none lg:rounded-bl-lg"
              />
            </div>
            <div className="w-full shrink-0 grow-0 basis-auto lg:w-6/12 xl:w-8/12">
              <div className="px-6 py-12 md:px-12">
                <h2 className="mb-4 text-3xl font-bold">
                  {data.book.volumeInfo?.title}
                </h2>
                <p className="mb-6 flex items-center font-bold uppercase text-danger dark:text-danger-500"></p>
                <p className="mb-6 text-black dark:text-neutral-300 font-bold">
                  {data.book.volumeInfo?.authors}
                </p>
                <p dangerouslySetInnerHTML={{
                  __html:data.book.volumeInfo?.description
                }} className="text-black dark:text-neutral-300">
                  
                </p>
                <br />
                {/* <a href={data.book.volumeInfo?.infoLink}>More Info</a> */}
                <a
                  href={data.book.volumeInfo?.infoLink}
                  className="text-xl text-blue-700"
                >
                  More Info
                </a>
                <br />
                <br />
                {!props.state.user ? (
                  <p>
                    <a className="text-xl text-blue-700" href="/login">
                      Login to add to favorites
                    </a>
                  </p>
                ) : // (props.state.user?.favorites.find(
                  //   (element) => element.book?.bookId === id
                  // ) ? (
                  // )}
                  props.state?.user?.favorites.find((f) => f.bookId === id) ? (
                    <button
                      className="bg-red-600 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-xl outline-none focus:outline-none mr-1 mb-1"
                      onClick={() => deleteFromFavorites(id)}
                    >
                      Delete from Favorites
                    </button>
                  ) : (
                    <button
                      className="bg-blue-600 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                      onClick={addToFavorites}
                    >
                      Add to Favorites
                    </button>
                  )}

                {/* {props.state.user ? (
                props.state.user?.favorites.includes(data.book.id) ? (
                  <button
                    className="bg-red-600 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-xl outline-none focus:outline-none mr-1 mb-1"
                    onClick={deleteFromFavorites}
                  >
                    Delete from Favorites
                  </button>
                ) : (
                  <button
                    className="bg-blue-600 text-white active:bg-blue-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1"
                    onClick={addToFavorites}
                  >
                    Add to Favorites
                  </button>
                )
              ) : (
                <p>
                  <a className="text-xl text-blue-700" href="/login">
                    Login to add to favorites
                  </a>
                </p>
              )} */}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="best" className="mb-10 text-center  ">
        <div className=" max-width ">
          <div className=" ">
            <h2 id="bestSellers" className="mb-6  text-3xl font-bold">
              If You Liked this Book, Check Out These
            </h2>
            <hr className="my-custom-line"></hr>
            <div className="grid grid-cols-4 gap-4">
            {similarBooks.slice(0, 4).map((book) => (
                <div key={book.id} className="p-2 border rounded-lg">
                  <a
                    className="block mb-2"
                    href={`/book/${book.id}`}
                  >
                    <img
                      className="object-cover  w-full mx-auto mb-2"
                      src={book.volumeInfo.imageLinks?.thumbnail || 'Image not available'}
                      alt={`${book.volumeInfo.title} cover`}
                    />
                  </a>
                  <h3 className="text-sm font-semibold mb-1">
                    {book.volumeInfo.title}
                  </h3>
                  <p className="text-xs text-gray-600">
                    Author(s): {book.volumeInfo.authors?.join(', ') || 'Unknown author'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Book;
