// Initialize variables
let posts = [];
let likeCount = {};
let whatsappNumber = '+34123456789'; // Change this to your WhatsApp number

// Load posts from localStorage
function loadPosts() {
    const saved = localStorage.getItem('facebookPosts');
    if (saved) {
        posts = JSON.parse(saved);
    }
}

// Save posts to localStorage
function savePosts() {
    localStorage.setItem('facebookPosts', JSON.stringify(posts));
}

// Create a new post
function createPost(content) {
    const post = {
        id: Date.now(),
        author: 'Juan Pérez',
        content: content,
        likes: 0,
        comments: [],
        timestamp: new Date().toLocaleString(),
        liked: false
    };
    posts.unshift(post);
    savePosts();
    renderPosts();
}

// Render all posts
function renderPosts() {
    const container = document.getElementById('posts-container');
    container.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post';
        postElement.innerHTML = `
            <div class=post-header>
                <img src=https://via.placeholder.com/40 alt=Profile class=post-avatar>
                <div class=post-info>
                    <strong>${post.author}</strong>
                    <p class=post-time>${post.timestamp}</p>
                </div>
            </div>
            <div class=post-content>
                <p>${post.content}</p>
            </div>
            <div class=post-stats>
                <span>${post.likes} Likes</span>
                <span>${post.comments.length} Comments</span>
            </div>
            <div class=post-actions>
                <button class=action-btn like-btn onclick=toggleLike(${post.id}) style=color: ${post.liked ? '#1877f2' : '#65676b'};>
                    <i class=fas fa-thumbs-up></i> Like
                </button>
                <button class=action-btn comment-btn onclick=toggleCommentBox(${post.id})>
                    <i class=fas fa-comment></i> Comment
                </button>
                <button class=action-btn whatsapp-btn onclick=shareWhatsApp('${post.content}')>
                    <i class=fab fa-whatsapp></i> Share on WhatsApp
                </button>
            </div>
            <div id=comment-box-${post.id} class=comment-box style=display:none;>
                <textarea placeholder=Write a comment... id=comment-text-${post.id}></textarea>
                <button onclick=addComment(${post.id})>Post Comment</button>
            </div>
            <div class=comments-section>
                ${post.comments.map((comment, index) => `
                    <div class=comment>
                        <strong>${comment.author}:</strong> ${comment.text}
                        <button class=delete-comment-btn onclick=deleteComment(${post.id}, ${index})>Delete</button>
                    </div>
                `).join('')}
            </div>
        `;
        container.appendChild(postElement);
    });
}

// Toggle like
function toggleLike(postId) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.liked = !post.liked;
        post.likes += post.liked ? 1 : -1;
        savePosts();
        renderPosts();
    }
}

// Toggle comment box
function toggleCommentBox(postId) {
    const commentBox = document.getElementById(`comment-box-${postId}`);
    commentBox.style.display = commentBox.style.display === 'none' ? 'block' : 'none';
}

// Add comment
function addComment(postId) {
    const commentText = document.getElementById(`comment-text-${postId}`).value;
    if (commentText.trim()) {
        const post = posts.find(p => p.id === postId);
        if (post) {
            post.comments.push({
                author: 'Current User',
                text: commentText
            });
            savePosts();
            renderPosts();
        }
    }
}

// Delete comment
function deleteComment(postId, commentIndex) {
    const post = posts.find(p => p.id === postId);
    if (post) {
        post.comments.splice(commentIndex, 1);
        savePosts();
        renderPosts();
    }
}

// Share on WhatsApp
function shareWhatsApp(content) {
    const text = encodeURIComponent(`Check out this post: ${content}`);
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${text}`;
    window.open(whatsappUrl, '_blank');
}

// Create post button
document.getElementById('publishBtn').addEventListener('click', function() {
    const postContent = document.getElementById('postInput').value;
    if (postContent.trim()) {
        createPost(postContent);
        document.getElementById('postInput').value = '';
    }
});

// Contact via WhatsApp button
document.getElementById('followBtn').addEventListener('click', function() {
    const contactText = encodeURIComponent('Hi! I would like to follow you!');
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${contactText}`;
    window.open(whatsappUrl, '_blank');
});

// Load posts on page load
document.addEventListener('DOMContentLoaded', function() {
    loadPosts();
    renderPosts();
});