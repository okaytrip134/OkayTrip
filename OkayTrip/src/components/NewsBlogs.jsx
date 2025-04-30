import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Bookmark, Calendar, Eye, ChevronRight, Loader2 } from 'lucide-react';

function NewsBlogs() {
  const [articles, setArticles] = useState([]);
  const [popularStories, setPopularStories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch articles from the backend - keeping your original logic
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/api/admin/blogs`);
        
        if (Array.isArray(response.data)) {
          const publishedArticles = response.data.filter(article => article.status === 'Published');
          
          // Sort articles by view count to get popular stories
          const sortedByViews = [...publishedArticles].sort((a, b) => 
            (b.views || 0) - (a.views || 0)
          );
          
          setArticles(publishedArticles);
          setPopularStories(sortedByViews.slice(0, 5)); // Get top 5 articles by views
        } else {
          console.error('Invalid response format: Expected an array');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching articles:', error);
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <section className="py-4  px-4 md:px- bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="mb-12 text-center md:text-left">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">Latest News & Insights</h2>
          <div className="w-24 h-1 bg-green-600 mx-auto md:mx-0"></div>
          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto md:mx-0">
            Stay updated with the latest trends, strategies, and insights from our expert team.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Main content - Articles Grid */}
          <div className="lg:w-2/3">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 size={40} className="animate-spin text-green-600" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {articles.length > 0 ? (
                  articles.map((article) => (
                    <div 
                      key={article.slug} 
                      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 flex flex-col h-full"
                    >
                      <div className="relative h-56 overflow-hidden">
                        <img 
                          src={article.image ? `${import.meta.env.VITE_APP_API_URL}${article.image}` : `/api/placeholder/600/400`}
                          alt={article.title} 
                          className="w-full h-full object-cover transition duration-700 hover:scale-105" 
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-grow">
                        <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                          <span className="font-medium">
                            By {article.author?.name || "Editorial Team"}
                          </span>
                          <span className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {formatDate(article.createdAt)}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4 line-clamp-2 hover:text-green-600 transition-colors">
                          {article.title}
                        </h3>
                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                          <div className="flex items-center text-gray-500 text-sm">
                            <Eye size={16} className="mr-1" />
                            <span>{article.views || 0} views</span>
                          </div>
                          <Link 
                            to={`/news-blog/${article.slug}`}
                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                          >
                            Read More
                            <ChevronRight size={16} className="ml-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 py-16 text-center text-gray-500">
                    <p>No articles found.</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Sidebar - Popular Stories */}
          <div className="lg:w-1/3 mt-10 lg:mt-0">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-6">
                <div className="p-2 bg-green-100 rounded-lg mr-3">
                  <Bookmark size={20} className="text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Popular Stories</h3>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 size={30} className="animate-spin text-green-600" />
                </div>
              ) : (
                <div className="space-y-6">
                  {popularStories.length > 0 ? (
                    popularStories.map((story, index) => (
                      <div 
                        key={story.slug}
                        className="flex gap-4 pb-5 border-b border-gray-200 last:border-0 last:pb-0 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                      >
                        <div className="text-2xl font-bold text-green-600 flex-shrink-0 w-8">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <div className="flex-1">
                          <Link to={`/news-blog/${story.slug}`}>
                            <h4 className="font-bold text-gray-800 hover:text-green-600 transition-colors mb-2 line-clamp-2">
                              {story.title}
                            </h4>
                          </Link>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500 flex items-center">
                              <Calendar size={14} className="mr-1" />
                              {formatDate(story.createdAt)}
                            </span>
                            <span className="text-gray-500 flex items-center">
                              <Eye size={14} className="mr-1" />
                              {story.views || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-10 text-center text-gray-500">
                      <p>No popular stories found.</p>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-8 pt-4 border-t border-gray-100">
                <Link 
                  to="/blogs"
                  className="w-full inline-flex items-center justify-center py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
                >
                  View All Articles
                  <ChevronRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
            
            {/* Additional Newsletter Signup Box
            <div className="mt-8 bg-green-50 rounded-xl p-6 shadow-lg border border-green-100">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Subscribe to Our Newsletter</h3>
              <p className="text-gray-600 mb-4">Get the latest industry insights delivered straight to your inbox.</p>
              <div className="space-y-3">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                />
                <button className="w-full py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors">
                  Subscribe Now
                </button>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}

export default NewsBlogs;