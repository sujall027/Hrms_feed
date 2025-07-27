import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Form } from 'react-bootstrap';
import {
  Heart, HeartFill, Chat, Share, Bookmark, BookmarkFill, ThreeDots
} from 'react-bootstrap-icons';
import './MainContent.css';

const MainContent = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: 'Alison Hata',
      initials: 'AH',
      content: 'Alison just completed 2 years in the company. Congratulate her!',
      image: null,
      likes: 24,
      comments: [],
      isLiked: false,
      isSaved: false
    },
    {
      id: 2,
      user: 'Harith Swanson',
      initials: 'HS',
      content: 'Thanks for leading one of the most productive design sprints ever, Rosia...',
      image: `${process.env.PUBLIC_URL}/images/group discussion.jpeg`,
      points: 200,
      recipient: 'Rosia Thorpe',
      likes: 42,
      comments: [
        {
          id: 1,
          user: 'Clarence Gale',
          initials: 'CG',
          content: 'Had an amazing experience working on the sprint...'
        }
      ],
      isLiked: true,
      isSaved: false
    },
    {
      id: 3,
      user: 'Travel Enthusiast',
      initials: 'TE',
      content: 'Beautiful sunset views from our last team retreat!',
      image: `${process.env.PUBLIC_URL}/images/sunset.jpeg`,
      likes: 87,
      comments: [],
      isLiked: false,
      isSaved: true
    }
  ]);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const handleLike = (postId) => {
    setPosts(posts.map(post => (
      post.id === postId
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    )));
  };

  const handleSave = (postId) => {
    setPosts(posts.map(post => (
      post.id === postId
        ? { ...post, isSaved: !post.isSaved }
        : post
    )));
  };

  const handleCommentSubmit = (e, postId) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const newCommentObj = {
          id: post.comments.length + 1,
          user: 'Current User',
          initials: 'CU',
          content: newComment
        };
        return { ...post, comments: [...post.comments, newCommentObj] };
      }
      return post;
    });

    setPosts(updatedPosts);
    setNewComment('');
  };

  return (
    <div className="main-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="feed-header">Feed</h4>
        <button
        className="theme-toggle-btn"
        onClick={() => setDarkMode(!darkMode)}
        title="Toggle dark mode"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>

      </div>

      {posts.map(post => (
        <Card key={post.id} className="mb-3 feed-card">
          <Card.Body>
            <div className="d-flex align-items-center justify-content-between mb-2">
              <div className="d-flex align-items-center flex-wrap">
                <div className="avatar me-2">{post.initials}</div>
                <strong>{post.user}</strong>
                {post.points && (
                  <>
                    <span className="mx-2">gave</span>
                    <Badge bg="warning" text="dark" className="points-badge">
                      {post.points} points
                    </Badge>
                    <span className="mx-2">to</span>
                    <strong>{post.recipient}</strong>
                  </>
                )}
              </div>
              <Button variant="link" className="p-0">
                <ThreeDots />
              </Button>
            </div>

            <Card.Text className={post.image ? 'mb-2' : 'mb-3'}>
              {post.content}
            </Card.Text>

            {post.image && (
              <div className="post-image mb-3">
                <img src={post.image} alt="Post content" className="img-fluid rounded" />
              </div>
            )}

            {post.points && (
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="d-flex">
                  <div className="avatar me-2">BL</div>
                  <div>
                    <strong>AlBomLeader</strong>
                    <div className="text-muted small">WITCH & CONTINUEL</div>
                  </div>
                </div>
                <Badge bg="light" text="dark" className="comments-badge">
                  {post.comments.length} comments
                </Badge>
              </div>
            )}

            <div className="d-flex justify-content-between mb-2 post-actions">
              <div className="d-flex">
                <Button variant="link" className="p-0 me-3 action-btn" onClick={() => handleLike(post.id)}>
                  {post.isLiked ? <HeartFill className="text-danger" /> : <Heart />}
                  <span className="ms-1">{post.likes}</span>
                </Button>
                <Button variant="link" className="p-0 me-3 action-btn">
                  <Chat />
                  <span className="ms-1">{post.comments.length}</span>
                </Button>
                <Button variant="link" className="p-0 action-btn">
                  <Share />
                </Button>
              </div>
              <Button variant="link" className="p-0 action-btn" onClick={() => handleSave(post.id)}>
                {post.isSaved ? <BookmarkFill className="text-dark" /> : <Bookmark />}
              </Button>
            </div>

            {post.id === 2 && (
              <div className="comments-section">
                <Form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Write a comment"
                    className="comment-box"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button type="submit" variant="primary" size="sm" className="mt-2 float-end" disabled={!newComment.trim()}>
                    Post
                  </Button>
                </Form>
                {post.comments.map(comment => (
                  <div key={comment.id} className="comment mb-2">
                    <div className="d-flex">
                      <div className="avatar me-2">{comment.initials}</div>
                      <div>
                        <strong>{comment.user}</strong>
                        <Card.Text>{comment.content}</Card.Text>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>
      ))}

      <Card className="feed-card">
        <Card.Body>
          <div className="d-flex align-items-center">
            <div className="avatar me-2">AK</div>
            <div>
              <strong>Asma Khouri</strong>
              <Card.Text>
                <span className="text-muted">+6 more</span> wished Asma a happy birthday.
                <Button variant="link" className="wish-link p-0 ms-1">Wish her now!</Button>
              </Card.Text>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default MainContent;
