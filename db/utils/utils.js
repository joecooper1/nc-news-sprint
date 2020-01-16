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
  const newList = comments.map(
    ({ belongs_to, created_by, created_at, ...comment }) => {
      return {
        ["article_id"]: articleRef[belongs_to],
        ["author"]: created_by,
        created_at: new Date(created_at),
        ...comment
      }; //instead of creating and deleting keys change the neame of the keys
    }
  );
  return newList;
};
