console.log("lets write java script")
let songs;
let currfolder;
let currentsong = new Audio();

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"
    }
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    remainingSeconds = (remainingSeconds < 10) ? "0" + remainingSeconds : remainingSeconds;

    return minutes + ":" + remainingSeconds;
}

async function getsongs(folder) {

    currfolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }
    //show all the song in the play list
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li><img src="img/music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20", " ")} </div>
            <div>Raghav</div>
        </div>
        <div class="playnow">
            <span>play now</span>
            <img class="invert" src="img/play.svg" alt="">
        </div>     
        </li>`;

    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playmusic(e.querySelector(".info").firstElementChild.innerHTML)
        })


    })
    return songs
}

const playmusic = (track, pause = false) => {
    currentsong.src = `/${currfolder}/` + track  //file /songs/ mia padi hui thi
    if (pause == false) {
        currentsong.play()
        play.src = "img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = track.replaceAll("%20"," ")
    document.querySelector(".songtime").innerHTML = "00:00/00:00"

}

async function displayAlbums() {
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardcontainer=document.querySelector(".cardcontainer")
    let array=Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
    
        if (e.href.includes("/songs")&& !e.href.includes(".htaccess")) { //string ke lie includes
            let folder = e.href.split("/")[4]
            //get the meta data of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response)
            cardcontainer.innerHTML= cardcontainer.innerHTML+`<div data-folder="${folder}" class="card">
            <div class="play">
                <div class="circular-box">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                        fill="black">
                        <path
                            d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                            stroke="black" stroke-width="1.5" stroke-linejoin="round" />
                    </svg>
                </div>
            </div>
            <img src="/songs/${folder}/cover.jpeg" alt="">
            <h4>${response.title}</h4>
            <p>${response.description}</p>
        </div>` // ye sb karne ke baadd mera card pe clicck kar ke automatic gaane load hone band ho gae uske lie mujhe addeventlistner usko iske andar leke ana hoga or for loop simple wali ka use karn ahoga     
        }
        

    }
    //load the playlist whenever the card is clicked

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            // console.log(item,item.target.dataset)  agar mai ye use kru or agar card ke andar image pe clivk kru to image milegi
            console.log(item, item.currentTarget.dataset) //par gar mai ye kru or chahe card ke andar khi bhi click karu to card to jispe event listner lga hoga vo milega 
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)
            playmusic(songs[0])
        })

    });

}

async function main() {
    songs = await getsongs("songs/punjabi")
    console.log(songs)
    playmusic(songs[0], true)
    //show all the songs in the playlist will be in getsongs function for card functionality

    //Display all the items dynamically
    displayAlbums()

    //add event listner to each buttons in play bar
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "img/play.svg"
        }
    })
    //listen for time update event
    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"
    })

    //add eventlistner to seek bar
    document.querySelector(".seekbar").addEventListener("click", e => {
        // console.log(e.offsetX,e.offsetY)
        // console.log(e.target.getBoundingClientRect().width,e.offsetX) mai kitna press kar sakta tha, maine kitna press kia 
        document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
        currentsong.currentTime = (currentsong.duration * (e.offsetX / e.target.getBoundingClientRect().width) * 100) / 100;
    })
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    //add next and previous event listner
    document.querySelector(".p").addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])
        }
    })
    document.querySelector(".n").addEventListener("click", () => {
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length - 1) {
            playmusic(songs[index + 1])
        }

    })
    // add event listner to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log(e, e.target.value)
        currentsong.volume = parseInt(e.target.value) / 100;
        if(currentsong.volume>0){
            document.querySelector(".volume>img").src=document.querySelector(".volume>img").src.replace("mute.svg","volume.svg")
        }
    })
    //add funtioning ki mai volume button mai babau ir vo mute ho jae
    document.querySelector(".volume>img").addEventListener("click",(e)=>{
        // console.log(e.target.src.split("/")[3])
        console.log(e.target.src.split("/")[4])
        let im=e.target.src.split("/")[4]
        if(im=="volume.svg"){
            e.target.src="img/mute.svg"
            currentsong.volume=0
            document.querySelector(".range").getElementsByTagName("input")[0].value=0
        }
        else{
            currentsong.volume=0.1
            e.target.src="img/volume.svg"
            document.querySelector(".range").getElementsByTagName("input")[0].value=10
        }
    })

}
main()

