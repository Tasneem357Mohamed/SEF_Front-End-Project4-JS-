const emailregex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordregex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/;

let users = [
    {
        firstname: "Nour",
        lastname: "Mohamed",
        email: "nour@gmail.com",
        password: "Nour_123!"
    },
    {
        firstname: "Ahmed",
        lastname: "Ali",
        email: "ahmed.ali@gmail.com",
        password: "Ahmed123@"
    },
    {
        firstname: "Sara",
        lastname: "Hassan",
        email: "sara.hassan@gmail.com",
        password: "SaraH!456"
    },
    {
        firstname: "Omar",
        lastname: "Youssef",
        email: "omar.y@gmail.com",
        password: "Omar_Y789#"
    },
    {
        firstname: "Laila",
        lastname: "Fahmy",
        email: "laila.f@gmail.com",
        password: "LailaF_987!"
    }
];

if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(users));
}


function showWarning(parentSelector, message) {
    const parent = document.querySelector(parentSelector);
    const oldWarning = parent.querySelector('.warning');
    if (oldWarning) oldWarning.remove();
    const warningMessage = document.createElement('p');
    warningMessage.classList.add('warning');
    warningMessage.textContent = message;
    warningMessage.style.color = "red";
    warningMessage.style.marginTop = "20px";
    warningMessage.style.marginBottom = "20px";
    parent.appendChild(warningMessage);
}

function register() {
    let firstname = document.querySelector('#exampleInputfirstname').value;
    let lastname = document.querySelector('#exampleInputlastname').value;
    let email = document.querySelector('#exampleInputEmail1').value;
    let password = document.querySelector('#exampleInputPassword1').value;
    document.querySelectorAll('.warning').forEach(el => el.remove());
    users = JSON.parse(localStorage.getItem('users')) || [];
    let exist = false;
    users.forEach(user => {
        if (user.email === email) {
            showWarning('.email', "This email is already registered. Please use another email.");
            exist = true;
        }
    });
    if (exist) return;
    if(passwordregex.test(password) && emailregex.test(email)) 
    {
        const user =
        {
            firstname: firstname,
            lastname: lastname,
            email: email,
            password:password    
        }
        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));
        document.querySelector('.register-form').reset();
        const oldWarning = document.querySelector('.warning');
        if (oldWarning) oldWarning.remove();
        alert("Register is done successfully ^^");
        window.location.href = "login.html";
    } 
    else 
    {
        if(!passwordregex.test(password)) {
            showWarning('.password', "Your password must be at least 8 characters, contain uppercase, lowercase, number and special character.");
        }
        if(!emailregex.test(email)) {
            showWarning('.email', "Your email must be a valid email address format like this: test@example.com");
        }
    }
}


function login() 
{
    const oldWarning = document.querySelector('.warning');
    if (oldWarning) oldWarning.remove();    
    let email = document.querySelector('#exampleInputEmail1').value;
    let password = document.querySelector('#exampleInputPassword1').value;  
    users = JSON.parse(localStorage.getItem('users')) || [];
    let currentUser = null;
    let exist = false;
    users.forEach(user => {
        if (user.email === email && user.password === password) 
        {
            currentUser = user;
            exist = true;
        }
    });
    if(exist)
    {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        alert("Login is done successfully ^^");
        document.querySelector('.login-form').reset;
        window.location.href = 'index.html';
    }
    else
    {
        const email = document.querySelector('.email');
        const warning = document.createElement('p');
        warning.classList.add('warning');
        warning.textContent = 'Email or password is incorrect!!!'
        warning.style.color = 'red';
        warning.style.fontSize = '18px'
        warning.style.marginTop = "15px";
        warning.style.marginBottom = "20px";
        email.insertAdjacentElement('beforeBegin', warning);
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const registerbtn = document.querySelector('.btn-register');
    if (registerbtn) {
        registerbtn.addEventListener('click', function(event) {
            event.preventDefault();
            register();
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const loginbtn = document.querySelector('.btn-login');
    if (loginbtn) {
        loginbtn.addEventListener('click', function(event) {
            event.preventDefault();
            login();
        });
    }
});

