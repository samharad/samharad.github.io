;#!/opt/homebrew/bin bb
;
;(require '[clojure.tools.cli :refer [parse-opts]])

(ns script.aoc
  (:require [hyperfiddle.rcf :as rcf]
            [clojure.string :as str]))

(rcf/enable!)

(defn absolute-ns-path-for [year day]
  (let [fmt-str "/Users/samadams/workspace/advent/advent-of-code-clojure/src/aoc/%s/day/%02d.clj"]
    (format fmt-str year day)))

(defn absolute-dest-path [year day]
  (let [fmt-str "/Users/samadams/workspace/blog/samharad.github.io/_drafts/aoc/%1$s/advent-of-code-%1$s-%2$02d.md"]
    (format fmt-str year day)))

(defn with-metadata [src-line]
  (let [type (cond
               (str/starts-with? src-line ";;") :line-comment
               :else :src)]
    {:type type :raw src-line}))

(defn remove-line-comment [s]
  (str/replace-first s #";; *" ""))

(defmulti grouping->md :type)

(defmethod grouping->md :line-comment [{:keys [lines]}]
  (->> lines
       (map remove-line-comment)
       (str/join "\n")))

(defmethod grouping->md :src [{:keys [lines]}]
  (let [lines (remove #(re-matches #"^\s*$" %) lines)
        code (str/join "\n" lines)]
    (if (seq lines)
      (str "```clojure\n" code "\n```\n")
      "")))

(defn grouped [rich-lines]
  (letfn [(to-section [lines]
            (let [type (:type (first lines))]
              {:type type :lines (map :raw lines)}))]
    (->> rich-lines
         (partition-by :type)
         (map to-section))))

(defn to-blog-md [src-str]
  (->> src-str
       (str/split-lines)
       (map with-metadata)
       (grouped)
       (map grouping->md)
       (str/join "\n")))

(defn frontmatter [year day]
  (let [lines ["---"
               "layout: post"
               (format "title: Advent of Code %s Day %02d" year day)
               "draft: true"
               "---"]]
    (str/join "\n" lines)))

(defn blog [year day content]
  (let [fm (frontmatter year day)]
    (str/join "\n" [fm content])))

(defn copy-to-blog! [year day]
  (let [source (slurp (absolute-ns-path-for year day))
        md (to-blog-md source)
        blog (blog year day md)]
    (spit (absolute-dest-path year day) blog)))


(rcf/tests

  (absolute-ns-path-for 2021 1) := "/Users/samadams/workspace/advent/advent-of-code-clojure/src/aoc/2021/day/01.clj"

  (absolute-dest-path 2021 1) := "/Users/samadams/workspace/blog/samharad.github.io/_drafts/aoc/2021/advent-of-code-2021-01.md"

  (to-blog-md ";; # Hello\n(hello)") := "# Hello\n```\n(hello)\n```\n"

  (frontmatter 2021 1) := "---\nlayout: post\ntitle: Advent of Code 2021 Day 01\ndraft: true\n---"

  (blog 2021 1 "foo") := "---\nlayout: post\ntitle: Advent of Code 2021 Day 01\ndraft: true\n---\nfoo")

(comment
  (copy-to-blog! 2021 1)
  ,)



