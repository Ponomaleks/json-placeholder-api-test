const userList = document.getElementById('users');
const API_URL = 'https://jsonplaceholder.typicode.com';
let users = [];
let formData = {
  name: '',
  username: '',
  address: '',
  phone: '',
  website: '',
  email: ''
};
let editableCardId;
let editableUserIdx;
let updateValues = {};
const formWrapper = document.querySelector('.edit-form-wrapper');
const form = document.querySelector('.edit-form');
const editBtn = document.querySelector('.edit-btn');
const loader = document.querySelector('.loader');

async function getUsers() {
  const url = `${API_URL}/users`;
  const response = await fetch(url);
  if (response.ok) {
    return await response.json();
  }
}

async function startApp() {
  loader.classList.add('show-loader');
  const data = await getUsers();
  users = [...users, ...data];
  renderUsers(users);
  loader.classList.remove('show-loader');
}

function renderUsers(list) {
  const markupArray = list.map(
    ({ id, name, username, phone, website, email }) => {
      return `<li class="profile">
        <div class="description">
          <p class="name">${name}</p>
          <p class="tag">@${username}</p>
         
        </div>

        <ul class="contacts">
          <li class="statsElem">
            <span class="label">phone</span>
            <span class="quantity">${phone}</span>
          </li>
          <li class="statsElem">
            <span class="label">website</span>
            <span class="quantity">${website}</span>
          </li>
          <li class="statsElem">
            <span class="label">email</span>
            <span class="quantity">${email}</span>
          </li>
        </ul>
        <ul class="controls">
        <li ><button class="btn tomato" onclick="editCard(${id})">EDIT</button></li>
        <li ><button class="btn red" onclick="deleteCard(${id})">DELETE</button></li>
        </ul>
      </li>`;
    }
  );

  const markup = markupArray.join('');
  userList.innerHTML = markup;
}

const editCard = async id => {
  editableCardId = id;
  formWrapper.classList.add('show');
  editableUserIdx = users.findIndex(el => el.id === id);
  const user = users[editableUserIdx];
  updateValues = user;
  Object.keys(user).forEach(key => {
    if (key !== 'id' && key !== 'company' && key !== 'address') {
      document.getElementById(key).value = user[key];
    }
  });
};

[...form.elements]
  .map(q => q.name)
  .forEach(key => {
    form[key].addEventListener('change', e => {
      updateValues[key] = e.target.value;
    });
  });

editBtn.addEventListener('click', async () => {
  loader.classList.add('show-loader');
  await updatePostRequest();
  users[editableUserIdx] = Object.assign(users[editableUserIdx], updateValues);
  renderUsers(users);
  formWrapper.classList.remove('show');
  loader.classList.remove('show-loader');
});

const deleteCard = async id => {
  loader.classList.add('show-loader');
  await removeUserRequest(id);
  users.splice(
    users.findIndex(el => el.id === id),
    1
  );
  renderUsers(users);
  loader.classList.remove('show-loader');
};

function removeUserRequest(id) {
  return fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    body: JSON.stringify(updateValues)
  });
}

function updatePostRequest() {
  return fetch(`${API_URL}/users/${editableCardId}`, {
    method: 'PUT',
    body: JSON.stringify(updateValues),
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  })
    .then(res => res.json())
    .then(data => data);
}

startApp();
