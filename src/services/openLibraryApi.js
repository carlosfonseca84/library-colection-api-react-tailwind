import axios from "axios";

const BASE_URL = "https://openlibrary.org";
const COVERS_URL = "https://covers.openlibrary.org/b/id";

export const getCoverUrl = (coverId, size = "M") =>
  coverId ? `${COVERS_URL}/${coverId}-${size}.jpg` : null;

export const searchBooks = async (query = "fiction", page = 1, limit = 12) => {
  const response = await axios.get(`${BASE_URL}/search.json`, {
    params: { q: query, page, limit, fields: "key,title,author_name,first_publish_year,cover_i,subject,subjects" },
  });
  return {
    books: response.data.docs,
    total: response.data.numFound,
    page,
  };
};

export const getBookDetail = async (workId) => {
  const response = await axios.get(`${BASE_URL}/works/${workId}.json`);
  return response.data;
};