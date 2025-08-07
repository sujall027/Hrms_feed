// MainContent.jsx
import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Form, Modal } from 'react-bootstrap';
import {
  Heart, HeartFill, Chat, Share, Bookmark, BookmarkFill, ThreeDots, Plus
} from 'react-bootstrap-icons';
import './MainContent.css';

const shareOptions = [
  { name: 'Instagram', icon: '📸' },
  { name: 'Snapchat', icon: '👻' },
  { name: 'WhatsApp', icon: '💬' },
  { name: 'Facebook', icon: '📘' },
];

const emojiList = ['👍', '❤️', '😂', '🎉', '😮'];

const MainContent = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [comments, setComments] = useState({});
  const [replies, setReplies] = useState({});
  const [showComments, setShowComments] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const [showShare, setShowShare] = useState(null);

  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);
  const [newPostTags, setNewPostTags] = useState('');
  const [newPostAttachment, setNewPostAttachment] = useState(null);
  const [showNewPostModal, setShowNewPostModal] = useState(false);

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
          content: 'Had an amazing experience working on the sprint...',
          replies: []
        }
      ],
      isLiked: true,
      isSaved: false
    }
  ]);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  const handleLike = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleSave = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, isSaved: !post.isSaved }
        : post
    ));
  };

  const handleCommentSubmit = (e, postId) => {
    e.preventDefault();
    const newComment = comments[postId]?.trim();
    if (!newComment) return;

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const newCommentObj = {
          id: Date.now(),
          user: 'Current User',
          initials: 'CU',
          content: newComment,
          replies: []
        };
        return { ...post, comments: [...post.comments, newCommentObj] };
      }
      return post;
    });

    setPosts(updatedPosts);
    setComments(prev => ({ ...prev, [postId]: '' }));
  };

  const handleReplySubmit = (e, postId, commentId) => {
    e.preventDefault();
    const newReply = replies[`${postId}-${commentId}`]?.trim();
    if (!newReply) return;

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.map(comment => {
          if (comment.id === commentId) {
            const newReplyObj = {
              id: Date.now(),
              user: 'Current User',
              initials: 'CU',
              content: newReply
            };
            return {
              ...comment,
              replies: [...comment.replies, newReplyObj]
            };
          }
          return comment;
        });
        return { ...post, comments: updatedComments };
      }
      return post;
    });

    setPosts(updatedPosts);
    setReplies(prev => ({ ...prev, [`${postId}-${commentId}`]: '' }));
    setShowReplies(prev => ({ ...prev, [`${postId}-${commentId}`]: false }));
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleReplyInput = (postId, commentId) => {
    const key = `${postId}-${commentId}`;
    setShowReplies(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleShareClick = (postId) => {
    setShowShare(showShare === postId ? null : postId);
  };

  const handleNewPostSubmit = () => {
    if (!newPostContent.trim()) return;
    const newPost = {
      id: Date.now(),
      user: 'You',
      initials: 'YO',
      content: newPostContent,
      image: newPostImage ? URL.createObjectURL(newPostImage) : null,
      tags: newPostTags,
      attachment: newPostAttachment ? newPostAttachment.name : null,
      likes: 0,
      comments: [],
      isLiked: false,
      isSaved: false
    };
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setNewPostImage(null);
    setNewPostTags('');
    setNewPostAttachment(null);
    setShowNewPostModal(false);
  };

  return (
    <div className="main-content">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="feed-header">Feed</h4>
        <div>
          <button className="btn btn-success me-2" onClick={() => setShowNewPostModal(true)}>
            <Plus className="me-1" /> Post
          </button>
          <button className="theme-toggle-btn btn btn-outline-dark" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>

      {posts.map(post => (
        <Card key={post.id} className="mb-3 feed-card">
          <Card.Body>
            <div className="d-flex justify-content-between mb-2 flex-wrap">
              <div className="d-flex align-items-center flex-wrap">
                <div className="avatar me-2">{post.initials}</div>
                <strong>{post.user}</strong>
                {post.points && (
                  <>
                    <span className="mx-2">gave</span>
                    <Badge bg="warning" text="dark" className="points-badge">{post.points} points</Badge>
                    <span className="mx-2">to</span>
                    <strong>{post.recipient}</strong>
                  </>
                )}
              </div>
              <Button variant="link" className="p-0"><ThreeDots /></Button>
            </div>

            <Card.Text>{post.content}</Card.Text>
            {post.tags && <div className="mb-2"><small className="text-muted">Tags: {post.tags}</small></div>}
            {post.attachment && <div className="mb-2"><small className="text-muted">Attachment: {post.attachment}</small></div>}
            {post.image && (
              <div className="post-image mb-3">
                <img src={post.image} alt="Post" className="img-fluid rounded" />
              </div>
            )}

            <div className="d-flex justify-content-between post-actions flex-wrap">
              <div className="d-flex flex-wrap">
                <Button variant="link" className="p-0 me-3 action-btn" onClick={() => handleLike(post.id)}>
                  {post.isLiked ? <HeartFill className="text-danger" /> : <Heart />}
                  <span className="ms-1">{post.likes}</span>
                </Button>
                <Button variant="link" className="p-0 me-3 action-btn" onClick={() => toggleComments(post.id)}>
                  <Chat />
                  <span className="ms-1">{post.comments.length}</span>
                </Button>
                <Button variant="link" className="p-0 action-btn" onClick={() => handleShareClick(post.id)}>
                  <Share />
                </Button>
              </div>
              <Button variant="link" className="p-0 action-btn" onClick={() => handleSave(post.id)}>
                {post.isSaved ? <BookmarkFill className="text-dark" /> : <Bookmark />}
              </Button>
            </div>

            {showShare === post.id && (
              <div className="custom-share-dropdown mb-3 p-3">
                {shareOptions.map(option => (
                  <Button key={option.name} variant="light" size="sm" className="custom-share-btn me-2 mb-2">
                    <span className="me-2">{option.icon}</span> Share on {option.name}
                  </Button>
                ))}
              </div>
            )}

            {showComments[post.id] && (
              <div className="comments-section mt-3">
                <Form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="mb-3">
                  <div className="d-flex flex-column flex-md-row gap-2">
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder="Write a comment"
                      className="comment-box w-100"
                      value={comments[post.id] || ''}
                      onChange={(e) =>
                        setComments(prev => ({ ...prev, [post.id]: e.target.value }))
                      }
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      size="sm"
                      disabled={!comments[post.id]?.trim()}
                      className="align-self-end"
                    >
                      Post
                    </Button>
                  </div>
                </Form>

                {post.comments.map(comment => (
                  <div key={comment.id} className="comment mb-3">
                    <div className="d-flex align-items-start">
                      <div className="avatar me-2">{comment.initials}</div>
                      <div className="flex-grow-1">
                        <strong>{comment.user}</strong>
                        <Card.Text className="mb-1">{comment.content}</Card.Text>

                        <div className="emoji-reactions my-1">
                          {emojiList.map((emoji, index) => (
                            <Button key={index} variant="light" size="sm" className="me-1 emoji-btn">
                              {emoji}
                            </Button>
                          ))}
                        </div>

                        <Button variant="link" size="sm" className="p-0 btn-link" onClick={() => toggleReplyInput(post.id, comment.id)}>
                          Reply
                        </Button>

                        {showReplies[`${post.id}-${comment.id}`] && (
                          <Form onSubmit={(e) => handleReplySubmit(e, post.id, comment.id)} className="mt-2">
                            <Form.Control
                              size="sm"
                              placeholder="Write a reply"
                              className="comment-box mb-2"
                              value={replies[`${post.id}-${comment.id}`] || ''}
                              onChange={(e) =>
                                setReplies(prev => ({
                                  ...prev,
                                  [`${post.id}-${comment.id}`]: e.target.value
                                }))
                              }
                            />
                            <Button type="submit" variant="secondary" size="sm" disabled={!replies[`${post.id}-${comment.id}`]?.trim()}>
                              Reply
                            </Button>
                          </Form>
                        )}

                        {comment.replies.length > 0 && comment.replies.map(reply => (
                          <div key={reply.id} className="mt-2 ms-4 comment">
                            <div className="d-flex align-items-start">
                              <div className="avatar me-2">{reply.initials}</div>
                              <div>
                                <strong>{reply.user}</strong>
                                <Card.Text className="mb-0">{reply.content}</Card.Text>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card.Body>
        </Card>
      ))}

      {/* Modal for Creating New Post */}
      <Modal show={showNewPostModal} onHide={() => setShowNewPostModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create New Post</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="What's on your mind?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Upload Image</Form.Label>
            <Form.Control type="file" accept="image/*" onChange={(e) => setNewPostImage(e.target.files[0])} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Tags (comma separated)</Form.Label>
            <Form.Control type="text" value={newPostTags} onChange={(e) => setNewPostTags(e.target.value)} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Attachment</Form.Label>
            <Form.Control type="file" onChange={(e) => setNewPostAttachment(e.target.files[0])} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNewPostModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleNewPostSubmit} disabled={!newPostContent.trim()}>Post</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MainContent;
