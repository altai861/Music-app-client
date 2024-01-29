import './style.css'

document.addEventListener("DOMContentLoaded", async () => {
    const app = document.getElementById("app");

    const apiUrl = "http://localhost:3500";

    const state = {
        user: null,
        songs: [],
        songPlaying: null
    }

    const loginUser = async (username, password) => {
        try {
            const response = await fetch(`${apiUrl}/auth/login`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                },
                credentials: 'include',
                body: JSON.stringify({ username: username, password: password })
            })

            const data = await response.json();

            if (response.ok) {
                console.log(data);
                state.user = data.username;
                checkUserAuth();
            } else {
                console.log("Login failed: ", data);
            }
        } catch (error) {
            console.log("Error during login: ", error);
        }
    }

    const registerUser = async (username, password) => {
        try {
            const response = await fetch(`${apiUrl}/auth/register`, {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ username, password })
            })

            const data = await response.json();

            if (response.ok) {
                console.log(data);
            } else {
                console.error("Registration failed: ", data);
            }
        } catch (error) {
            console.error("Error during register: ", error)
        }
    }
    
    const logOut = async () => {
        try {
            // Make a GET request to the logout endpoint on the server
            const response = await fetch(`${apiUrl}/auth/logout`, {
                method: 'GET',
                credentials: 'include', // Include cookies in the request if needed
                headers: {
                    'Content-Type': 'application/json',
                    // Add any additional headers if necessary
                },
            });
    
            if (response.ok) {
                // Successful logout
                console.log('Logged out successfully');
                // Perform any client-side cleanup or redirection as needed
            } else {
                // Handle unsuccessful logout (e.g., server error)
                console.error('Logout failed:', response.statusText);
            }
        } catch (error) {
            // Handle network or other errors
            console.error('Error during logout:', error);
        }
    };
    

    const renderApp = () => {
        app.innerHTML = "";

        checkUserAuth();
    }

    const checkUserAuth = async () => {
        if (await fetchSongs()) {
            console.log(state.songs)
            renderMainWindow();
        } else {
            console.log("You are not authenticated");
            renderLogin();
        }
    }

    const renderLogin = () => {
        app.innerHTML = "";
        const loginForm = document.createElement("form");

        loginForm.id = "login-form"

        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const username = event.target.elements.username.value;
            const password = event.target.elements.password.value;
            await loginUser(username, password);
        })

        loginForm.innerHTML = `
            <h2>Нэвтрэх</h2>
            <label for="username">Хэрэглэгчийн нэр:</label>
            <input type="text" id="username" name="username" required>
            <label for="password">Нууц үг:</label>
            <input type="password" id="password" name="password" required>
            <button type="submit">нэвтрэх</button>
        `;
        app.appendChild(loginForm);
    }


    const fetchSongs = async () => {
        try {
            const response = await fetch(`${apiUrl}/song`, {
                credentials: 'include',
            })
            const data = await response.json();

            if (response.ok) {
                console.log(data);
                state.songs = data;
                //state.user = data.user
                return true
            } else {
                console.log("Fetching songs is failed: ", data);
                return false
            }
        } catch (error) {
            console.error("Error fetching songs: ", error);
        }
    }

    const renderMainWindow = async () => {
        app.innerHTML = "";

        const header = await createHeader();

        app.appendChild(header);
    }

    const createHeader = async () => {
        const header = document.createElement("div");
        header.id = "header"

        const addSongHeaderElement = await createAddSongHeaderElement()

        const allSongsHeaderElement = await createAllSongsHeaderElement()
        
        const button = await createLogoutButton();

        header.appendChild(addSongHeaderElement)
        header.appendChild(allSongsHeaderElement)
        header.appendChild(button);

        return header
    }

    const createAllSongsHeaderElement = async () => {
        const a = document.createElement("a");
        a.classList.add("header-element");
        a.textContent = "Бүх дуунууд"

        a.addEventListener("click", async () => {
            await fetchSongs();
            await renderMusics();
        })

        return a;
    }

    const renderMusics = async () => {
        await renderMainWindow();

        const songsDiv = await createSongs();

        app.appendChild(songsDiv);
    }

    const createAddSongHeaderElement = async () => {
        const a = document.createElement("a");
        a.classList.add("header-element")
        a.textContent = "Дуу нэмэх"

        a.addEventListener("click", async () => {
            await renderAddSongForm();
        })

        return a;
    }

    const renderAddSongForm = async () => {
        await renderMainWindow();

        const formDiv = document.createElement("div");

        /*
        <h2>What is up? Wanna listen some music?</h2>
    <form id="addSongForm">
        <input type="text" name="songTitle" id="songTitle" required>
        <input type="text" name="artistName" id="artistName" required>
        <input type="text" name="genre" id="genre" required>
        <input type="date" name="releaseDate" id="releaseDate" required>
        <input type="file" name="songFile" id="songFile" accept="audio/*" required>
        <input type="submit" value="Add">
    </form>
        */

        const h2Element = document.createElement("h2");
        h2Element.textContent = "Юу байна? гоё дуу сонсох уу?"

        const addSongForm = document.createElement("form");
        addSongForm.id = "addSongForm"

        const songTitleInput = document.createElement("input");
        songTitleInput.type = "text";
        songTitleInput.name = "songTitle";
        songTitleInput.id = "songTitle";
        songTitleInput.placeholder = "Дууны нэр";
        songTitleInput.required = true

        const artistNameInput = document.createElement("input");
        artistNameInput.type = "text";
        artistNameInput.name = "artistName";
        artistNameInput.id = "artistName";
        artistNameInput.placeholder = "Дуучны нэр";
        artistNameInput.required = true

        const genreInput = document.createElement("input");
        genreInput.type = "text";
        genreInput.name = "genre";
        genreInput.id = "genre";
        genreInput.placeholder = "Genre";
        genreInput.required = true
        
        const dateInput = document.createElement("input");
        dateInput.type = "date";
        dateInput.name = "releaseDate";
        dateInput.id = "releaseDate";
        dateInput.placeholder = "Release date";
        dateInput.required = true

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.name = "songFile";
        fileInput.id = "songFile";
        fileInput.accept = "audio/*";
        fileInput.required = true

        const submitInput = document.createElement("input");
        submitInput.type = "submit";
        submitInput.value = "нэмэх"

        addSongForm.appendChild(songTitleInput);
        addSongForm.appendChild(artistNameInput);
        addSongForm.appendChild(genreInput);
        addSongForm.appendChild(dateInput);
        addSongForm.appendChild(fileInput);
        addSongForm.appendChild(submitInput);

        formDiv.appendChild(addSongForm)

        addSongForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log("Add song form submitted")
            await uploadSong();
        })

        app.appendChild(formDiv);
    }

    const uploadSong = async () => {
        const songTitle = document.getElementById("songTitle").value;
        const artistName = document.getElementById("artistName").value;
        const genre = document.getElementById("genre").value;
        const releaseDate = document.getElementById("releaseDate").value;
        const songFile = document.getElementById("songFile").files[0];

        const formData = new FormData();
        formData.append("songTitle", songTitle);
        formData.append("artistName", artistName);
        formData.append("genre", genre);
        formData.append("releaseDate", releaseDate);
        formData.append("songFile", songFile);

        const response = await fetch('http://localhost:3500/song', {
            method: 'POST',
            body: formData,
            credentials: "include"
        });

        const json = await response.json();

        console.log(json);

        if (response.ok) {
            alert("Uploaded the song");
            clearSongForm()
        } else {
            alert("Error while uploading the song")
        }
    }

    const clearSongForm = () => {
        const songTitle = document.getElementById("songTitle");
        const artistName = document.getElementById("artistName");
        const genre = document.getElementById("genre");
        const releaseDate = document.getElementById("releaseDate");
        const songFile = document.getElementById("songFile");

        songTitle.value = ""
        artistName.value = ""
        genre.value = ""
        releaseDate.value = ""
        songFile.value = ""
    }

    const createLogoutButton = async () => {
        const logoutButton = document.createElement("button");

        logoutButton.id = "logout-button"
    
        // Add a user icon (👤) to the button text
        logoutButton.innerHTML = "&#128100; Logout";
    
        logoutButton.addEventListener("click", async () => {
            await logOut();
            window.location.reload();
        });
    
        return logoutButton;
    }

    const createSongs = async () => {
        const songs = document.createElement("div");
        state.songs.forEach(async (song) => {
            const singleSong = await createSingleSongElement(song);
            songs.appendChild(singleSong);
        })

        return songs;
    }

    const createSingleSongElement = async (song) => {
        const songElement = document.createElement("div");
        const h3 = document.createElement("h3");
        h3.textContent = song.songTitle;
        const p = document.createElement("p");
        p.textContent = song.artistName;
        const release = document.createElement("p");
        release.textContent = song.releaseDate.split("T")[0].substring(0, 4) + " " + song.genre;

        const audio = document.createElement("audio");
        audio.src = song.publicUrl
        audio.controls = true;

        songElement.appendChild(h3);
        songElement.appendChild(p);
        songElement.appendChild(release);
        songElement.appendChild(audio);


        console.log(song)
        return songElement
    }


    renderApp();

})