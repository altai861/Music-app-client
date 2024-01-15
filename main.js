import './style.css'


const formElement = document.getElementById("addSongForm");

formElement.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const artist = document.getElementById('artist').value;
    const genre = document.getElementById('genre').value;
    const date = document.getElementById('date').value;
    const audioFile = document.getElementById('audio').files[0];

    if (!title || !artist || !genre || !audioFile || !date) {
        console.error('Missing required parameters.');
        return;
    }

    const songData = {
        songTitle: title,
        artistName: artist,
        genre: genre,
        releaseDate: date,
        songFile: audioFile
    }

    const formData = new FormData();
    formData.append("songTitle", title);
    formData.append("artistName", artist);
    formData.append("genre", genre);
    formData.append("releaseDate", date);
    formData.append("songFile", audioFile);

    console.log(formData);

    try {
        const response = await fetch('http://localhost:3500/song', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: formData,
        })
    
        if (response.ok) {
            const result = await response.json();
            console.log("Success: ", result);
        } else {
            const error = await response.text();
            console.error("Error: ", error);
        }
    } catch (error) {
        console.error(error);
    }
    
})

