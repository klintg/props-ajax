var Comment = React.createClass({
  rawMarkup: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return { __html: rawMarkup };
  },
  render: function() {
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>

        <span dangerouslySetInnerHTML={this.rawMarkup()} />

      </div>
    );
  }
});
//the commentList here is the parent and it is passing data down to the
// comment component. data from the parent is available as a property on the
//child component.this properties are accessed via {this.props}
// we are passing the 'hadid k'(via an attribute) {this.props.author}
//we are passing the "this is one comment" via xml  {this.props.children}
var CommentList = React.createClass({
  render: function() {
    var commentNodes = this.props.data.map(function(post) {
      return (
        <Comment author={post.author} key={post.id}>
          {post.text}
        </Comment>
      )
    })
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var CommentForm = React.createClass({

  getInitialState: function() {
   return {author: '', text: ''};
 },

 handleAuthorChange: function(e) {
   this.setState({author: e.target.value});
 },

 handleTextChange: function(e) {
   this.setState({text: e.target.value});
 },

 handleSubmit: function(e) {
   e.preventDefault()
   var author = this.state.author.trim()
   var text = this.state.text.trim()
   if(!text || !author) {
     return;
   }
    this.props.onCommentSubmit({author: author, text:text})
    this.setState({ author: '', text:""})
 },
  render: function() {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
      <input
        type="text"
        placeholder="Your name"
        value={this.state.author}
        onChange={this.handleAuthorChange}
      />
      <input
        type="text"
        placeholder="Say something..."
        value={this.state.text}
        onChange={this.handleTextChange}
      />
        <input type="submit" value="Post" />
      </form>
    );
  }
});



var CommentBox = React.createClass({

  handleCommentSubmit: function(comment) {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function() {
    return {data:[]}
  },

  loadPosts: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data})
      }.bind(this),
      error:function(xhr, status, err) {
        console.error(this.props.url, status, err.toString())
      }.bind(this)
    })
  },

  componentDidMount:function() {
    this.loadPosts()
    setInterval(this.loadPosts, this.props.interval)
  },

  render: function() {
    return (
      <div className="commentBox">
        {this.props.name}
        <CommentList data={this.state.data}/>
        <CommentForm onCommentSubmit={this.handleCommentSubmit}/>
      </div>
    );
  }
});


ReactDOM.render(
  <CommentBox name="Gitahi"  url="/api/comments" interval={2000}/>,
  document.getElementById('content')
);

//when the component is created we want to get some JSON  from the server
//update the state to reflect the latest data.we use jquery to make an asychronus
// request to the server to fetch the data that we require.

/*
* we need to pass data from the child component back up to the parent
we do this in the parent render method by passing a new callback in to
the child, binding it to the child
*/
