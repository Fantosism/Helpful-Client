import React, { useState } from 'react';

const UserComments = () => {
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const onChange = event => {
    setComment(event.target.value);
  };
  
  const onSubmit = event => {
    event.preventDefault();
    setComment('');
    setComments([...comments, comment]);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label>Comments</label>
        <textarea style={{ background: '#ccc' }} onChange={onChange} />
        <button type="submit">Add a public comment</button>
      </form>
      <ul>
        {comments.map(item => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserComments;
