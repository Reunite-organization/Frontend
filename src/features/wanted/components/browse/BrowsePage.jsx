import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  MapPin,
  Calendar,
  Heart,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { usePosts } from "../../hooks/usePosts";
import { PostGrid } from "./PostGrid";
import { SearchFilters } from "./SearchFilters";
import { ImpactStats } from "../layout/ImpactStats";
import { SuccessStories } from "../shared/SuccessStories";
import { LoadingSkeleton } from "../shared/LoadingSkeleton";
import { useLanguage } from "../../../../lib/i18n";
import { Link } from "react-router-dom";

export const BrowsePage = () => {
  const { language } = useLanguage();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    city: "",
    year: "",
    category: "",
  });

  const { data, isLoading, fetchNextPage, hasNextPage } = usePosts(filters);
  const allPosts = data?.pages?.flatMap((page) => page?.data || page?.posts || []) || [];

  return (
    <div className="min-h-screen bg-warm-white">
      {/* Hero Section with Search */}
      <section className="relative bg-gradient-to-b from-cream to-transparent pt-24 pb-12">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center space-y-6"
          >
            {/* Mission Statement */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-warmth/10 rounded-full">
              <Sparkles className="w-4 h-4 text-terracotta" />
              <span className="text-sm font-medium text-olive">
                {language === "am"
                  ? "በዓለም ዙሪያ ከ89 ሀገራት የመጡ ልጥፎች"
                  : "Posts from 89 countries around the world"}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-display font-bold text-charcoal">
              {language === "am"
                ? "የሚፈልጉትን ሰው ያግኙ"
                : "Find who you're looking for"}
            </h1>

            <p className="text-lg text-stone max-w-2xl mx-auto">
              {language === "am"
                ? "በሺዎች የሚቆጠሩ ልጥፎችን ያስሱ። በከተማ፣ በአመት ወይም በምድብ ያጣሩ።"
                : "Browse thousands of posts. Filter by city, year, or category."}
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone" />
                  <input
                    type="text"
                    placeholder={
                      language === "am"
                        ? "ስም፣ ከተማ ወይም ቁልፍ ቃል ይፈልጉ..."
                        : "Search by name, city, or keyword..."
                    }
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-white dark:bg-charcoal/10 rounded-2xl border border-warm-gray focus:border-terracotta focus:ring-2 focus:ring-terracotta/20 transition-all outline-none"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`px-4 rounded-2xl border transition-all ${
                    showFilters
                      ? "bg-terracotta text-white border-terracotta"
                      : "bg-white dark:bg-charcoal/10 border-warm-gray hover:border-terracotta"
                  }`}
                >
                  <Filter className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                {[
                  "Addis Ababa",
                  "Washington DC",
                  "London",
                  "Toronto",
                  "2020",
                  "Childhood",
                ].map((tag) => (
                  <button
                    key={tag}
                    className="px-4 py-1.5 text-sm bg-cream hover:bg-warm-gray rounded-full text-olive transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Expanded Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6"
            >
              <SearchFilters filters={filters} onChange={setFilters} />
            </motion.div>
          )}
        </div>
      </section>

      {/* Impact Stats Banner */}
      <section className="py-8 border-y border-warm-gray/30 bg-cream/30">
        <div className="container">
          <ImpactStats compact />
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-display font-bold text-charcoal">
              {language === "am" ? "የቅርብ ጊዜ ልጥፎች" : "Recent Posts"}
            </h2>
            <span className="text-sm text-stone">
              {data?.pages[0]?.total || 0}{" "}
              {language === "am" ? "ልጥፎች" : "posts"}
            </span>
          </div>

          {isLoading ? (
            <LoadingSkeleton type="grid" count={8} />
          ) : (
            <PostGrid
              posts={allPosts}
              hasMore={hasNextPage}
              loadMore={fetchNextPage}
              isLoading={isLoading}
            />
          )}
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 bg-gradient-to-b from-transparent to-cream/50">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-hope-green/10 rounded-full mb-4">
              <Heart className="w-4 h-4 text-hope-green" />
              <span className="text-sm font-medium text-hope-green">
                {language === "am" ? "የተሳካላቸው ታሪኮች" : "Success Stories"}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-charcoal mb-4">
              {language === "am"
                ? "እንደገና የተገናኙ ሰዎች"
                : "People who found each other"}
            </h2>
            <p className="text-stone max-w-2xl mx-auto">
              {language === "am"
                ? "በፈላጊዬ አማካኝነት እንደገና የተገናኙ እውነተኛ ታሪኮች።"
                : "Real stories of people reconnected through Falagiye."}
            </p>
          </div>

          <SuccessStories limit={3} />

          <div className="text-center mt-10">
            <Link
              to="/wanted/stories"
              className="btn-outline inline-flex items-center gap-2"
            >
              {language === "am" ? "ሁሉንም ታሪኮች ይመልከቱ" : "View all stories"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-terracotta to-sahara p-12 md:p-16 text-center">
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20 L30 20 L30 30 L20 30 Z' fill='white' fill-opacity='0.1'/%3E%3C/svg%3E")`,
                }}
              />
            </div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                {language === "am"
                  ? "እርስዎ የሚፈልጉት ማነው?"
                  : "Who are you looking for?"}
              </h2>
              <p className="text-white/90 text-lg mb-8">
                {language === "am"
                  ? "የራስዎን ልጥፍ ይፍጠሩ እና ማህበረሰቡ እንደገና እንዲገናኙ ይርዳዎታል።"
                  : "Create your own post and let the community help you reconnect."}
              </p>
              <Link
                to="/wanted/create"
                className="btn-primary bg-white text-terracotta hover:bg-warm-white"
              >
                {language === "am" ? "ልጥፍ ይፍጠሩ" : "Create a Post"}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
