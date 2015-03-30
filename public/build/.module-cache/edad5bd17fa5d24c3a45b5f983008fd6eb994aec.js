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

	componentDidMount: function() {
		this.loadCommentsFromServer();
		setInterval(this.loadCommentsFromServer, this.props.pollInterval);
	},

	render: function() {
		return (
			React.createElement("div", null, 
				React.createElement("h1", null, "Comments"), 
				React.createElement(CommentList, {data: this.state.data}), 
				React.createElement(CommentForm, null)
				)
			);
	}

});

// CommentList
var CommentList = React.createClass({
	displayName:'CommentList',
	render: function() {
		var commentNodes = this.props.data.map(function (comment) {
			return (
				React.createElement(Comment, {author: comment.author}, comment.text)
				)
		});


		return (
			React.createElement("div", {className: "commentList"}, 
				commentNodes		
			)
		)
	}
});

// CommentForm
var CommentForm = React.createClass({
	displayName:'CommentForm',

	handleCommentPost: function(e) {
		e.preventDefault();
		var author = React.findDOMNode(this.refs.author).value.trim();
		var text = React.findDOMNode(this.refs.text).value.trim();
		if (!text || !author) {
			return;
		}

		//todo send request to server 

		// clear form
		React.findDOMNode(this.refs.author).value = '';
		React.findDOMNode(this.refs.text).value = '';
		return;
		
	},
	render: function() {
		return(
			React.createElement("form", {className: "commentForm"}, 
				React.createElement("input", {type: "text", placeholder: "name", ref: "author"}), 
				React.createElement("input", {type: "text", placeholder: "comment", ref: "text"}), 
				React.createElement("input", {type: "submit", value: "post comment"})
			)	
		);
	}
});

// Comment
var Comment = React.createClass({
	displayName: 'Comment',
	render: function() {
		return (
			React.createElement("div", {className: "comment"}, 
				React.createElement("h2", {className: "commentAuthor"}, 
					this.props.author
				), 
				this.props.children
			)
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
	React.createElement(CommentBox, {url: "comments.json", pollInterval: 2000}),
	document.getElementById('content')
);