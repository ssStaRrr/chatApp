const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const path = require("path")
const { connectDB } = require("./db/connectDB")
const session = require('express-session');
const User = require("./models/user")
const Message = require("./models/message")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

const HOST = "172.16.119.148" // bu ip ile gelen baglantilari kabul et . Evdeki IP 192.168.1.106
const PORT = process.env.PORT || 5000;
connectDB().then(message => {
    console.log(message)
    server.listen(PORT, HOST, () => {
    console.log(`Sunucu ${PORT} portunda calisiyor`);
    });
})

// Oturum (session) middleware'i oluşturma
const sessionMiddleware = session({
    secret: 'super_secret_key',
    resave: false,
    saveUninitialized: true,
});

// Express.js için session middleware'i ekleyin
app.use(sessionMiddleware);

io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
});

app.use(express.json());
//Statik dosyalari sunma
app.use(express.static(path.join(__dirname, "public")))

// Socket.io bağlantılarını yönetme
io.on("connection", (socket) => {
    console.log("bir kullanici baglandi")

    // Socket ile oturumu ilişkilendir
    const session = socket.request.session;

    //Kullanıcı mesaj gönderdiğinde
    socket.on("chat message", async(msg) => {
        if(session.username) {
            // Mesajı diğer kullanıcılara gönder    
            io.emit("chat message", {username: session.username, msg:msg})
        }
    })
    //Kullanici ayrildiginda
    socket.on("disconnect", () => {
        console.log("bir kullanici ayrildi")
    })
})


// Login işlemi
app.post("/login", async(req,res) => {
    const {username, password} = req.body
    const user = await User.findOne({username})

    if(user && password===user.password) {
        req.session.username = username
        res.status(200).send("Giris Basarili")
    } else {
        res.status(401).send("Giris basarisiz")
    }
})

//Chat Sayfasi (login islemi gerektirir)
app.get("/chat", async(req,res) => {
    if(!req.session.username) {
        return res.redirect("login.html")
    }

    //Mesajlari chat sayfasina gonder
    res.redirect("index.html")
})

app.get("/loginPage", (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
})