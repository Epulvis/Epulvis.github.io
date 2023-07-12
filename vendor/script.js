fetch("https://seleksi-sea-2023.vercel.app/api/movies")
.then((response) => response.json())
.then((data) => {
// Render movies on the page
const moviesContainer = document.getElementById("movies__container");

data.forEach((movie) => {
const movieCard = document.createElement("div");
movieCard.classList.add("movie__card");

const poster = document.createElement("img");
poster.classList.add("movie__image");
poster.src = movie.poster_url;
movieCard.appendChild(poster);

const title = document.createElement("h2");
title.classList.add("movie__title");
title.textContent = movie.title;
movieCard.appendChild(title);

// Menampilkan modal saat movie__card diklik
movieCard.addEventListener("click", () => {
const modal = document.getElementById("modal");
modal.style.display = "block";

// Mengisi konten modal dengan informasi film
const movieTitle = movieCard.querySelector(".movie__title").textContent;
const modalTitle = document.querySelector(".modal__content h2");
modalTitle.textContent = movieTitle;

const movieImage = movieCard.querySelector(".movie__image").src;
const modalImage = document.querySelector(".modal__content img");
modalImage.src = movieImage;

const modalDescription = document.querySelector(".modal__description");
modalDescription.textContent = movie.description;

const modalRating = document.querySelector(".modal__rating");
modalRating.textContent = `Age Rating: ${movie.age_rating}`;

let modalPrice = document.querySelector(".modal__price");
modalPrice.textContent = `Price: 0`; // Set initial price to 0

// Daftar kursi yang tersedia
const availableSeats = Array(64).fill(true);

// Kursi yang dipilih oleh pengguna
const selectedSeats = [];

// Fungsi untuk memperbarui tampilan kursi
function updateSeats() {
const seatsContainer = document.getElementById("seats__container");
seatsContainer.innerHTML = "";

for (let i = 0; i < availableSeats.length; i++) {
const seat = document.createElement("div");
seat.className = "seat";
seat.innerText = i + 1;

if (!availableSeats[i]) {
seat.style.backgroundColor = "#cd8c38";
seat.style.pointerEvents = "none";
} else {
seat.addEventListener("click", () => selectSeat(i));
}

seatsContainer.appendChild(seat);
}
}

// Fungsi untuk memilih kursi
function selectSeat(seatIndex) {
if (selectedSeats.length < 6 && availableSeats[seatIndex]) {
selectedSeats.push(seatIndex);
availableSeats[seatIndex] = false;
updateSeats();

// Perbarui harga berdasarkan jumlah kursi yang dipilih
modalPrice.textContent = `Price: ${selectedSeats.length * movie.ticket_price}`;
}
}

updateSeats();
});

moviesContainer.appendChild(movieCard);});
})
.catch((error) => {
console.error("Error:", error);});

// Menutup modal saat tombol close diklik
const closeModal = document.querySelector(".close");
closeModal.addEventListener("click", () => {
const modal = document.getElementById("modal");
modal.style.display = "none";});

const checkoutButton = document.querySelector(".modal__button");
checkoutButton.addEventListener("click", () => {

const name = document.getElementById("name").value;
console.log("Name:", name);

const modalTitle = document.querySelector(".modal__content h2").textContent;
console.log("Title:", modalTitle);

const unselectedSeats = document.querySelectorAll(".seat[style='background-color: rgb(205, 140, 56); pointer-events: none;']");
unselectedSeats.forEach((seat) => {
console.log("Selected Seats:", seat.innerText); });

const totalPrice = parseInt(document.querySelector(".modal__price").textContent.split(" ")[1]);
console.log("Total Price:", totalPrice);

});

// top up
const topUpBtn = document.getElementById("topUpBtn");
const balanceElement = document.querySelector(".balance");

if (localStorage.getItem("balance")) {
const savedBalance = parseFloat(localStorage.getItem("balance"));
balanceElement.textContent = "Rp " + savedBalance.toLocaleString("id-ID");
}

topUpBtn.addEventListener("click", function () {
const amount = prompt("Masukkan jumlah top up:");

const topUpAmount = parseFloat(amount);

if (!isNaN(topUpAmount) && topUpAmount > 0) {

const currentBalance = parseFloat(
balanceElement.textContent.slice(3).replace(/\./g, "")
);

const newBalance = currentBalance + topUpAmount;

const formattedBalance = newBalance.toLocaleString("id-ID");

balanceElement.textContent = "Rp " + formattedBalance;

localStorage.setItem("balance", newBalance);

alert("Top up berhasil! Saldo baru: Rp " + formattedBalance);
} else {

alert("Jumlah top up tidak valid!");
}
});

// withdraw
const withdrawBtn = document.getElementById("withdrawBtn");

withdrawBtn.addEventListener("click", function () {

const amount = prompt("Masukkan jumlah withdraw:");

const withdrawAmount = parseFloat(amount);

if (!isNaN(withdrawAmount) && withdrawAmount > 0) {

const currentBalance = parseFloat(
balanceElement.textContent.slice(3).replace(/\./g, "")
);

if (currentBalance >= withdrawAmount) {

const newBalance = currentBalance - withdrawAmount;

const formattedBalance = newBalance.toLocaleString("id-ID");

balanceElement.textContent = "Rp " + formattedBalance;

localStorage.setItem("balance", newBalance);

alert("Withdraw berhasil! Saldo baru: Rp " + formattedBalance);
} else {

alert("Saldo tidak mencukupi!");
}
} else {

alert("Jumlah withdraw tidak valid!");
}
});