var CommentBox = React.createClass({displayName: 'CommentBox',
	getInitialState: function() {
		return {
			data: []
		};
	},

	loadCommentsFromServer: function () {

		$.ajax({
			url: this.props.url,
			dataType: 'json',
			success: function(data) {
				this.setState({data:data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},

	handleCommentSubmit: function(comment) {
		
		$.ajax({
			url: this.props.url,
			dataType:'json',
			type:'POST',
			data:comment,
			success: function(data) {
				this.setState({data:data});
			}.bind(this),
			error: function(xhr,status,err) {
				console.error(this.props.url,status,err.toString());
			}.bind(this)
		})


	},

	componentDidMount: function() {
		this.loadCommentsFromServer();
		setInterval(this.loadCommentsFromServer, this.props.pollInterval);
	},

	render: function() {
		return (
			<div>
				<h1>Comments</h1>
				<CommentList data={this.state.data} />
				<CommentForm onCommentSubmit={this.handleCommentSubmit} />
				</div>
			);
	}

});

// CommentList
var CommentList = React.createClass({
	displayName:'CommentList',
	render: function() {
		var commentNodes = this.props.data.map(function (comment) {
			return (
				<Comment author={comment.author}>{comment.text}</Comment>
				)
		});


		return (
			<div className="commentList">
				{commentNodes}		
			</div>
		)
	}
});

// CommentForm
var CommentForm = React.createClass({
	displayName:'CommentForm',

	handleSubmit: function(e) {
		e.preventDefault();
		var author = React.findDOMNode(this.refs.author).value.trim();
		var text = React.findDOMNode(this.refs.text).value.trim();
		if (!text || !author) {
			return;
		}

		// send to server
		commentObj = {author:author, text:text};
		console.log('comment',this.props);
		this.props.onCommentSubmit(commentObj);

		// clear form
		React.findDOMNode(this.refs.author).value = '';
		React.findDOMNode(this.refs.text).value = '';
		return;

	},
	render: function() {
		return(
			<form className="commentForm" onSubmit={this.handleSubmit}>
				<input type="text" placeholder="name" ref="author" />
				<input type="text" placeholder="comment" ref="text" />
				<input type="submit" value="post comment" />
			</form>	
		);
	}
});

// Comment
var Comment = React.createClass({
	displayName: 'Comment',
	render: function() {
		return (
			<div className='comment'>
				<h2 className="commentAuthor">
					{this.props.author}
				</h2>
				{this.props.children}
			</div>
			)
	}
});


var data = [
	{
		author: 'Tony Pony',
		text: 'This is the first comment'
	},

	{
		author: 'Uncle Waffle',
		text: 'I eat waffles.'
	}
]

React.render(
	<CommentBox url="comments.json" pollInterval={2000} />,
	document.getElementById('content')
);