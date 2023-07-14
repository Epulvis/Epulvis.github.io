const moviesContainer = document.getElementById("movies__container");
const modal = document.getElementById("modal");
const seatsContainer = document.getElementById("seats__container");
const nameInput = document.getElementById("name");
const ageInput = document.getElementById("age");
const modalTitleElement = document.querySelector(".modal__content h2");
const modalImage = document.querySelector(".modal__content img");
const modalDescription = document.querySelector(".modal__description");
const modalRating = document.querySelector(".modal__rating");
const modalPriceElement = document.querySelector(".modal__price");
const modalPrice = document.querySelector(".modal__price");
const balanceElement = document.querySelector(".balance");
const ticketContainer = document.querySelector(".card__ticket");
const ticketTitleElement = document.querySelector(".ticket__title");
const ticketMovieElement = document.querySelector(".ticket__movie");
const ticketNameElement = document.querySelector(".ticket__name");
const ticketPriceElement = document.querySelector(".ticket__price");
const closeModal = document.querySelector(".close");
const topUpBtn = document.getElementById("topUpBtn");
const withdrawBtn = document.getElementById("withdrawBtn");
const tiketBtn = document.getElementById("tiketBtn");
const card = document.querySelector(".tiket");
const closeCard = document.querySelector(".card__close");
const checkoutButton = document.getElementById("checkoutButton");

let balance = localStorage.getItem("balance") || 0;
const formattedBalance = parseFloat(balance).toLocaleString("id-ID");
balanceElement.textContent = `Rp ${formattedBalance}`;

if (balance === 0) {
  localStorage.setItem("balance", balance);
}

let selectedMovie;

let selectedSeats = {};
const availableSeats = Array(64).fill(true);

fetch("https://seleksi-sea-2023.vercel.app/api/movies")
  .then((response) => response.json())
  .then((data) => {
    renderMovies(data);
  })
  .catch((error) => {
    console.error("Error:", error);
  });

function renderMovies(data) {
  data.forEach((movie) => {
    const movieCard = createMovieCard(movie);
    moviesContainer.appendChild(movieCard);
  });
}

function createMovieCard(movie) {
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

  movieCard.addEventListener("click", () => {
    showModal(movie);
  });

  return movieCard;
}

function showModal(movie) {
  if (!selectedSeats[movie.title]) {
    selectedSeats[movie.title] = [];
  } else {
    selectedSeats[movie.title].forEach((seatIndex) => {
      availableSeats[seatIndex] = true;
    });
    selectedSeats[movie.title] = [];
  }

  modal.style.display = "block";
  selectedMovie = movie;

  modalTitleElement.textContent = movie.title;
  modalImage.src = movie.poster_url;
  modalDescription.textContent = movie.description;
  modalRating.textContent = `Age Rating: ${movie.age_rating}`;
  modalPrice.textContent = "Price: Rp 0";

  updateSeats();
}

function updateSeats() {
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

function selectSeat(seatIndex) {
  if (
    selectedSeats[selectedMovie.title].length < 6 &&
    availableSeats[seatIndex]
  ) {
    selectedSeats[selectedMovie.title].push(seatIndex);
    availableSeats[seatIndex] = false;
    updateSeats();

    modalPrice.textContent = `Price: Rp ${
  (selectedSeats[selectedMovie.title].length * selectedMovie.ticket_price).toLocaleString("id-ID")
}`;
  }
}

checkoutButton.addEventListener("click", handleCheckout);

function handleCheckout() {
  const name = nameInput.value;
  const age = parseInt(ageInput.value);
  const totalPrice = selectedSeats[selectedMovie.title].length * selectedMovie.ticket_price;
  const modalTitle = modalTitleElement.textContent;
  
  if (!name || !age || totalPrice === 0) {
    alert("Harap isi semua kolom dan pilih seat yang tersedia");
    return;
  }

  const ageRating = `Age Rating: ${selectedMovie.age_rating}`;
  modalRating.textContent = ageRating;

  let newBalance = parseFloat(localStorage.getItem("balance")) - totalPrice;

  if (isNaN(newBalance)) {
    alert("Terjadi kesalahan. Harap coba lagi.");
    return;
  }

  if (age < selectedMovie.age_rating) {
    alert("Maaf umur anda kurang:");
    return;
  }

  if (newBalance <= 0) {
    alert("Saldo tidak mencukupi. Harap melakukan top up.");
    return;
  }

  localStorage.setItem("balance", newBalance.toString());
  balanceElement.textContent = `Rp ${newBalance.toLocaleString("id-ID")}`;

  selectedSeats[selectedMovie.title].length = 0;
  const selectedSeatsCount = selectedSeats[selectedMovie.title].length;

  ticketMovieElement.textContent = selectedMovie.title;
  ticketNameElement.textContent = name;
  ticketPriceElement.textContent = `Rp ${totalPrice.toLocaleString("id-ID")}`;
  
  const selectedSeatsElements = document.querySelectorAll(
    `.seat[style='background-color: rgb(205, 140, 56); pointer-events: none;']`
  );

  let ticketSeat2Element = document.getElementById("ticketSeat2");

  if (ticketSeat2Element === null) {
  const ticketContainer = document.createElement("div");
  ticketContainer.classList.add("ticket__container", "ticket__second");

  const eye = document.createElement("div");
  eye.classList.add("eye");

  ticketSeat2Element = document.createElement("h3");
  ticketSeat2Element.classList.add("ticket__seat");
  ticketSeat2Element.id = "ticketSeat2";
    
  const ticketInfo = document.createElement("span");
  ticketInfo.classList.add("ticket__info");
  ticketInfo.textContent = "seat";

  ticketContainer.appendChild(eye);
  ticketContainer.appendChild(ticketSeat2Element);
  ticketContainer.appendChild(ticketInfo);

  const ticketContainerParent = document.querySelector(".card__ticket");
  ticketContainerParent.appendChild(ticketContainer);
}

ticketSeat2Element.textContent = selectedSeats[selectedMovie.title][1] + 1;


  modal.style.display = "none";
  card.style.display = "block";
}



closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

// Top-up button event listener
topUpBtn.addEventListener("click", function() {
  const amount = prompt("Masukkan jumlah top up:");
  const topUpAmount = parseFloat(amount);

  if (!isNaN(topUpAmount) || topUpAmount <= 0) {
    const currentBalance = parseFloat(balanceElement.textContent.slice(3).replace(/\./g, ""));
    const newBalance = currentBalance + topUpAmount;

    if (!isNaN(newBalance)) {
      const formattedBalance = newBalance.toLocaleString("id-ID");
      balanceElement.textContent = "Rp " + formattedBalance;
      localStorage.setItem("balance", newBalance);

      alert("Top up berhasil! Saldo baru: Rp " + formattedBalance);
    } else {
      alert("Terjadi kesalahan. Harap coba lagi.");
    }
  } else {
    alert("Jumlah top up tidak valid!");
  }
});

withdrawBtn.addEventListener("click", function() {
  const amount = prompt("Masukkan jumlah withdraw:");
  const withdrawAmount = parseFloat(amount);

  if (!isNaN(withdrawAmount) || withdrawAmount <= 0) {
    const currentBalance = parseFloat(balanceElement.textContent.slice(3).replace(/\./g, ""));

    if (currentBalance >= withdrawAmount) {
      const newBalance = currentBalance - withdrawAmount;

      if (!isNaN(newBalance)) {
        balance = newBalance;
        localStorage.setItem("balance", newBalance);

        alert("Withdraw berhasil! Saldo baru: Rp " + newBalance.toLocaleString("id-ID"));
      } else {
        alert("Terjadi kesalahan. Harap coba lagi.");
      }
    } else {
      alert("Saldo tidak mencukupi!");
    }
  } else {
    alert("Jumlah withdraw tidak valid!");
  }
});



tiketBtn.addEventListener("click", () => {
  card.style.display = "block";
});

closeCard.addEventListener("click", () => {
  card.style.display = "none";
});