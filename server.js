import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/latio_db';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Models
const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: { type: String, required: true },
    imageUrl: { type: String, required: true },
    author: { type: String, default: 'Latio Team' }
}, { timestamps: true });

const partnerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    sector: String
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);
const Partner = mongoose.model('Partner', partnerSchema);

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, default: 'new' }
}, { timestamps: true });

const Contact = mongoose.model('Contact', contactSchema);

// Routes for Blogs
app.get('/api/blogs', async (req, res) => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/blogs', async (req, res) => {
    try {
        const newBlog = new Blog(req.body);
        await newBlog.save();
        res.status(201).json(newBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/api/blogs/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog not found' });
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/blogs/:id', async (req, res) => {
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/blogs/:id', async (req, res) => {
    try {
        await Blog.findByIdAndDelete(req.params.id);
        res.json({ message: 'Blog post deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Routes for Partners
app.get('/api/partners', async (req, res) => {
    try {
        const partners = await Partner.find();
        res.json(partners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/partners', async (req, res) => {
    try {
        const newPartner = new Partner(req.body);
        await newPartner.save();
        res.status(201).json(newPartner);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put('/api/partners/:id', async (req, res) => {
    try {
        const updatedPartner = await Partner.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedPartner);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/partners/:id', async (req, res) => {
    try {
        await Partner.findByIdAndDelete(req.params.id);
        res.json({ message: 'Partner deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Routes for Contacts
app.get('/api/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find().sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/contacts', async (req, res) => {
    try {
        const newContact = new Contact(req.body);
        await newContact.save();

        // Log notification to console
        console.log('\x1b[36m%s\x1b[0m', `\n🚀 [NEW CONTACT] ${new Date().toLocaleString()}`);
        console.log(`👤 Khách hàng: ${newContact.name}`);
        console.log(`📞 SĐT: ${newContact.phone}`);
        console.log(`📧 Email: ${newContact.email}`);
        console.log(`💬 Nội dung: ${newContact.message}`);
        console.log('\x1b[36m%s\x1b[0m', '-----------------------------------\n');

        res.status(201).json(newContact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.delete('/api/contacts/:id', async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ message: 'Contact deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.patch('/api/contacts/:id', async (req, res) => {
    try {
        const updatedContact = await Contact.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        res.json(updatedContact);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('Latio AI Server (Blog & Partners) is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
