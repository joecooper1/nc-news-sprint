exports.formatDates = list => {
  const newList = list.map(article => {
    const newArticle = { ...article };
    newArticle.created_at = new Date(newArticle.created_at);
    return newArticle;
  });
  return newList;
};

exports.makeRefObj = (list, property1, property2) => {
  let obj = {};
  list.forEach(thing => {
    obj[thing[property1]] = thing[property2];
  });
  return obj;
};

exports.formatComments = (comments, articleRef) => {
  const newList = comments.map(comment => {
    const newComment = { ...comment };
    newComment.article_id = articleRef[newComment.belongs_to];
    delete newComment.belongs_to;
    newComment.created_at = new Date(newComment.created_at);
    newComment.author = newComment.created_by;
    delete newComment.created_by;
    return newComment;
  });
  return newList;
};
