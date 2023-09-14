
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const MOVED_EVENT = "moved-book";
const DELETED_EVENT = "deleted-book";
const STORAGE_KEY = "BOOKSHELF_APPS";
const buku = [];

const isStorageExist = () => {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung web storage");
    return false;
  }
  return true;
};

document.addEventListener(RENDER_EVENT, () => {
  const unfinishedBook = document.getElementById("unRead");
  unfinishedBook.innerHTML = "";

  const finishedBook = document.getElementById("doneRead");
  finishedBook.innerHTML = "";

  for (const bookItem of buku) {
    const bookElement = makeElementOfBook(bookItem);
    if (!bookItem.isComplete) {
      unfinishedBook.append(bookElement);
    } else {
      finishedBook.append(bookElement);
    }
  }
});

document.addEventListener(SAVED_EVENT, () => {
  const elementCustomAlert = document.createElement("div");
  elementCustomAlert.classList.add("alert");
  elementCustomAlert.innerText = "Data Anda Berhasil Disimpan!";

  document.body.insertBefore(elementCustomAlert, document.body.children[0]);
  setTimeout(() => {
    elementCustomAlert.remove();
  }, 2000);
});

document.addEventListener(MOVED_EVENT, () => {
  const elementCustomAlert = document.createElement("div");
  elementCustomAlert.classList.add("alert");
  elementCustomAlert.innerText = "Data Anda Berhasil Dipindahkan!";

  document.body.insertBefore(elementCustomAlert, document.body.children[0]);
  setTimeout(() => {
    elementCustomAlert.remove();
  }, 2000);
});

document.addEventListener(DELETED_EVENT, () => {
  const elementCustomAlert = document.createElement("div");
  elementCustomAlert.classList.add("alert");
  elementCustomAlert.innerText = "Data Anda Berhasil Dihapus!";

  document.body.insertBefore(elementCustomAlert, document.body.children[0]);
  setTimeout(() => {
    elementCustomAlert.remove();
  }, 2000);
});

const loadDataFromStorage = () => {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (data !== null) {
    for (const item of data) {
      buku.push(item);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
};

const saveData = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(buku);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
};

const moveData = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(buku);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(MOVED_EVENT));
  }
};

const deleteData = () => {
  if (isStorageExist()) {
    const parsed = JSON.stringify(buku);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(DELETED_EVENT));
  }
};


const makeElementOfBook = (bookObject) => {
  const elementBookTitle = document.createElement("p");
  elementBookTitle.classList.add("element-title");
  elementBookTitle.innerHTML = `${bookObject.title} <span>(${bookObject.year})</span>`;

  const elementBookAuthor = document.createElement("p");
  elementBookAuthor.classList.add("element-writer");
  elementBookAuthor.innerText = bookObject.author;

  const descContainer = document.createElement("div");
  descContainer.classList.add("element-desc");
  descContainer.append(elementBookTitle, elementBookAuthor);

  const actionContainer = document.createElement("div");
  actionContainer.classList.add("element-action");

  const container = document.createElement("div");
  container.classList.add("element");
  container.append(descContainer);
  container.setAttribute("id", `book-${bookObject.id}`);

  if (bookObject.isComplete) {
    const returnBtn = document.createElement("button");
    returnBtn.classList.add("kembalikan-btn");
    returnBtn.innerHTML = `<i class='bx bx-undo'></i>`;

    returnBtn.addEventListener("click", () => {
      returnBook(bookObject.id);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("hapus-btn");
    deleteBtn.innerHTML = `<i class='bx bx-trash'></i>`;

    deleteBtn.addEventListener("click", () => {
      deleteBook(bookObject.id);
    });

    actionContainer.append(returnBtn, deleteBtn);
    container.append(actionContainer);
  } else {
    const finishBtn = document.createElement("button");
    finishBtn.classList.add("selesai-btn");
    finishBtn.innerHTML = `<i class='bx bx-check'></i>`;

    finishBtn.addEventListener("click", () => {
      addBookFinish(bookObject.id);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("hapus-btn");
    deleteBtn.innerHTML = `<i class='bx bx-trash'></i>`;

    deleteBtn.addEventListener("click", () => {
      deleteBook(bookObject.id);
    });

    actionContainer.append(finishBtn, deleteBtn);
    container.append(actionContainer);
  }

  return container;
};

const tambahBuku = () => {
  const bookTitle = document.getElementById("judul");
  const bookAuthor = document.getElementById("penulis");
  const bookYear = document.getElementById("tahun");
  const bookHasFinished = document.getElementById("isRead");
  let bookStatus;

  if (bookHasFinished.checked) {
    bookStatus = true;
  } else {
    bookStatus = false;
  }

  buku.push({
    id: +new Date(),
    title: bookTitle.value,
    author: bookAuthor.value,
    year: Number(bookYear.value),
    isComplete: bookStatus,
  });

  bookTitle.value = null;
  bookAuthor.value = null;
  bookYear.value = null;
  bookHasFinished.checked = false;

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
};

const addBookFinish = (bookId) => {
  const bookTarget = findOfBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  moveData();
};

const returnBook = (bookId) => {
  const bookTarget = findOfBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  moveData();
};

const deleteBook = (bookId) => {
  const bookTarget = findIndexOfBook(bookId);

  if (bookTarget === -1) return;

  buku.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  deleteData();
};

document.addEventListener("DOMContentLoaded", () => {
  if (isStorageExist()) {
    loadDataFromStorage();
  }

  const simpanForm = document.getElementById("formDataBuku");
  simpanForm.addEventListener("submit", (event) => {
    event.preventDefault();
    tambahBuku();
  });

  // const searchForm = document.getElementById("formSearch");
  // searchForm.addEventListener("submit", (event) => {
  //   event.preventDefault();
  //   searchBook();
  // });

  // const resetBtn = document.querySelector(".reset-btn");
  // resetBtn.addEventListener("click", () => {
  //   document.getElementById("pencarian").value = "";
  //   searchBook();
  // });
});

const findOfBook = (bookId) => {
  for (const bookItem of buku) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }

  return null;
};

const findIndexOfBook = (bookId) => {
  for (const index in buku) {
    if (buku[index].id === bookId) {
      return index;
    }
  }

  return -1;
};

// const searchBook = () => {
//   const searchInput = document.getElementById("pencarian").value.toLowerCase();
//   const bookItems = document.getElementsByClassName("element");

//   for (let i = 0; i < bookItems.length; i++) {
//     const itemTitle = bookItems[i].querySelector(".element-title");
//     if (itemTitle.textContent.toLowerCase().includes(searchInput)) {
//       bookItems[i].classList.remove("hidden");
//     } else {
//       bookItems[i].classList.add("hidden");
//     }
//   }
// };
