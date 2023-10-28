let showOnlyBorrowed = false;
const bookList = document.getElementById('bookList');

document.querySelector('#bookForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const edition = document.getElementById('edition').value;
  const year = document.getElementById('year').value;
  const genre = document.getElementById('addGenre').value;
  const pages = document.getElementById('pages').value;
  const stored = document.getElementById('stored').value;
  const image = document.getElementById('image').value;

  const book = {
    title: title,
    author: author,
    edition: edition,
    year: year,
    genre: genre,
    pages: pages,
    stored: stored,
    image: image,
    borrowed: false
  };
  saveBook(book);

  displayBooksFromStorage();
  document.getElementById('bookForm').reset();
});

document.querySelector('#showBorrowed').addEventListener('click', function(event) {
  event.preventDefault();
  showOnlyBorrowed = !showOnlyBorrowed;
  displayBooksFromStorage(showOnlyBorrowed);
  document.getElementById('showBorrowed').textContent = showOnlyBorrowed ? 'Mostrar todos' : 'Mostrar emprestados';
});

document.querySelector('#searchByName').addEventListener('input', function(event) {
  const searchTerm = event.target.value.trim().toLowerCase();
  const books = getBooksFromStorage();

  if (searchTerm.trim() === '') {
    displayBooksFromStorage();
  } else {
    bookList.innerHTML = '';
    const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filteredBooks && filteredBooks.length > 0) {
      filteredBooks.forEach(book => {
        addBookToList(book);
      })
    } else {
      bookList.innerHTML = '<p class="notFound">Nenhum livro encontrado com este nome.</p>';
    }
  }
});

document.querySelector('#filterGenre').addEventListener('change', function(event) {
  const selectedOption = event.currentTarget.value;
  bookList.innerHTML = '';
  const books = getBooksFromStorage();
  const filteredBooks = books.filter(book => book.genre.toLowerCase() === selectedOption.toLowerCase());
  
  if (filteredBooks && filteredBooks.length > 0) {
    filteredBooks.forEach(book => {
      addBookToList(book);
    })
  } else if (selectedOption === '') {
    displayBooksFromStorage();
  } else {
    bookList.innerHTML = '<p class="notFound">Nenhum livro encontrado com este gênero.</p>';
  }
});

document.querySelector('#deleteAll').addEventListener('click', function() {
  localStorage.clear();
  location.reload()
});

document.addEventListener('DOMContentLoaded', function() {
  displayBooksFromStorage();
  checkingBookList();
});

const displayBooksFromStorage = (onlyBorrowed = false) => {
  bookList.innerHTML = '';

  const books = getBooksFromStorage();
  if (books && books.length > 0) {
    books.forEach(book => {
      if (!onlyBorrowed || (onlyBorrowed && book.borrowed)) {
        addBookToList(book);
      }
    });
  }
};

const getBooksFromStorage = () => {
  const books = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key !== null && key.startsWith('book_')) {
      const bookData = JSON.parse(localStorage.getItem(key));
      books.push(bookData);
    }
  }
  return books;
};

const addBookToList = (book) => {
  const li = document.createElement('li');
  li.innerHTML = `
      <div class="bookCard">
         <img class="bookImage" src="${book.image}" alt="${book.title}">
         <p class="pages">páginas: ${book.pages}</p>
         <h3 class="titulo">${book.title}</h3>
         <p class="emprestado">${book.borrowed ? 'Emprestado' : ''}</p>
      
        <div class="autor">
          <strong>${book.author}</strong>
        </div>
        
        <div class="editGen">
          <span>Ano: ${book.year}</span>
          <span>Edição: ${book.edition}</span>
          <span>Genêro: ${book.genre}</span>
          <p class="pages">Armazenado em: ${book.stored}</p>
        </div>
          
         <div>
          <button id="alugar" class="borrow-button">${book.borrowed ? 'Devolver' : 'Alugar'}</button>
          <button class="delete">Excluir</button>
         </div>
      </div>
    `;

  li.querySelector('.delete').addEventListener('click', function() {
    li.remove();
    removeBookFromStorage(book.title);
  });

  li.querySelector('.borrow-button').addEventListener('click', function(event) {
    event.preventDefault();

    if (book.borrowed) {
      book.borrowed = false;
    } else {
      book.borrowed = true;
    }
    saveBook(book);
    displayBooksFromStorage();
    checkingBookList();
  });

  if (bookList.firstChild) {
    bookList.insertBefore(li, bookList.firstChild);
  } else {
    bookList.appendChild(li);
  }
}

const saveBook = (book) => {
  localStorage.setItem(`book_${book.title}`, JSON.stringify(book));
  checkingBookList();
};

const removeBookFromStorage = (title) => {
  localStorage.removeItem(`book_${title}`);
};

const checkingBookList = () => {
  const books = getBooksFromStorage();
  const notFound = document.querySelector('.notFound');

  if (books.length === 0) {
    notFound.innerHTML = 'Nenhum livro encontrado. Cadastre um livro novo!';
  } else {
    notFound.innerHTML = '';
  }
}