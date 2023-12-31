import axios from "axios";
import { useEffect, useState } from "react";

const token = process.env.REACT_APP_IPINFO_TOKEN;

function Dashboard(props) {
  const [location, setLocation] = useState("Location Loading...");
  async function deleteFromFavorites(favoriteId) {
    try {
      const {
        data: { user },
      } = await axios.delete(`/api/favorites/${favoriteId}`);

      props.setState({
        ...props.state,
        user,
      });
    } catch (error) {
      console.error("Error deleting favorite:", error);
    }
  }

  useEffect(() => {
    const locationElement = document.getElementById("location");

    // Fetch the user's location based on their IP address using ipinfo.io API
    fetch("https://ipinfo.io?token=a12fa57358328f")
      .then((response) => response.json())
      .then((data) => {
        const city = data.city || "Unknown City";
        const region = data.region || "Unknown Region";
        const country = data.country || "Unknown Country";

        const locationText = `${city}, ${region}, ${country}`;
        // locationElement.innerHTML = `
        //   <i className="fas fa-map-marker-alt mr-2 text-lg text-blueGray-400"> ${locationText}</i>

        // `;

        setLocation(locationText);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  return (
    <>
      <main className="profile-page">
        <section className="relative block h-500-px">
          <div
            className="absolute top-0 w-full h-full bg-center bg-cover"
            style={{
              backgroundImage:
                "url('https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')",
            }}
          >
            <span
              id="blackOverlay"
              className="w-full h-full absolute opacity-50 bg-black"
            ></span>
          </div>
          <div className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px">
            <svg
              className="absolute bottom-0 overflow-hidden"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
              version="1.1"
              viewBox="0 0 2560 100"
              x="0"
              y="0"
            >
              <polygon
                className="text-blueGray-200 fill-current"
                points="2560 0 2560 100 0 100"
              ></polygon>
            </svg>
          </div>
        </section>
        <section className="relative py-16 bg-blueGray-200">
          <div className="container mx-auto px-4">
            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
              <div className="px-6">
                <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                    <div className="relative">
                      <img
                        alt="..."
                        src="https://img.freepik.com/free-vector/cute-earth-planet-wearing-glasses_1308-124297.jpg?w=2000"
                        className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                    <div className="py-6 px-3 mt-32 sm:mt-0">
                      <a href="#favorites">
                        <button
                          className="bg-blue-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-xl shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150"
                          type="button"
                        >
                          View Favorites
                        </button>
                      </a>
                    </div>
                  </div>
                  <div className="w-full lg:w-4/12 px-4 lg:order-1">
                    <div className="flex justify-center py-4 lg:pt-4 pt-8">
                      <div className="mr-4 p-3  text-center">
                        <span className="text-5xl font-bold block uppercase tracking-wide text-blueGray-600">
                          {props.state.user?.favorites?.length}
                        </span>
                        <span className="text-xl text-blueGray-400">
                          Saved Books
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div id="favorites" className="text-center mt-12">
                  <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700">
                    {props.state.user?.username?.toUpperCase()}
                  </h3>
                  <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-900 font-bold uppercase">
                    <i id="location" className="mr-2 text-lg text-blueGray-400">
                      {location}
                    </i>
                  </div>
                  <div className="mb-2 text-blueGray-600 mt-10">
                    <i className="font-semibold mr-2 text-2xl text-center text-blueGray-700">
                      Member Since
                    </i>
                  </div>
                  <div className="mb-6 text-blueGray-600">
                    {/* Check if createdAt is available before rendering */}
                    {props.state.user?.createdAt ? (
                      <span className="text-3xl text-center">
                        {new Date(
                          props.state.user.createdAt
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    ) : (
                      <span>User not found</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <h2 id="favorites" className="mb-1 text-center mt-6 text-4xl font-bold">
        Favorites
      </h2>
      <hr className="my-custom-line"></hr>

      {!props.state.user?.favorites?.length && (
        <p className="text-center mb-32">
          You haven't favorited any books yet!
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
        {props.state.user?.favorites?.map((favorite) => (
          <div
            className="bg-white h-full rounded-lg shadow-md p-4"
            key={favorite._id}
          >
            <div className="text-center flex items-center justify-center my-auto">
              <a href={`book/${favorite.bookId}`}>
                <img
                  className="object-cover w-full mx-auto mb-2"
                  alt={favorite.title}
                  src={favorite.image}
                />
                <h3 className="text-sm font-semibold mb-1">{favorite.title}</h3>
              </a>
            </div>
            <button
              className="bg-red-500  text-white w-full font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-xl outline-none focus:outline-none mr-1 mb-1"
              onClick={() => deleteFromFavorites(favorite.bookId)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

export default Dashboard;

{
  /* 
 <h2 className="text-3xl font-bold text-center">Welcome, {props.state.user?.username}!</h2>
       <h3 className="text-xl font-bold text-center">Here are your favorite books:</h3>

       {!props.state.user?.favorites.length && ( 
         <p className="text-center">You haven't favorited any books yet!</p>
       )}

       <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-5">
       {props.state.user?.favorites.map((favorite) => (
         <div className="bg-white rounded-lg shadow-md p-4" key={favorite._id}>
           <div className="text-center flex items-center justify-center">
           <a href={`book/${favorite.bookId}`}>
             <img alt={favorite.title} src={favorite.image} />
             <h3>{favorite.title}</h3>
           </a>
           </div>
           <button className="bg-red-500  text-white w-full font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1" onClick={() => deleteFromFavorites(favorite._id)}>Delete</button>
         </div>
       ))}
       </div> */
}
