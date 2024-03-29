---
layout: post
title: "Advent of Code 2021: Day 13"
---
Day 13 was a very satisfying midnight solve -- more on why below!
```clojure
(ns aoc.2021.day.13
  (:require [clojure.string :as str]
            [hyperfiddle.rcf :as rcf]))

(rcf/enable!)
```

The [puzzle](https://adventofcode.com/2021/day/13) deals with a
transparent sheet of paper marked  up with dots; the dots are at
integer coordinates. We're asked to fold the paper along some
horizontal and vertical lines.

The input is given as a list of comma-separated (x, y)
coordinates followed by descriptions of the folds:
```clojure
(def t-in)
"6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5"

(def input "745,436\n810,236\n487,101\n938,527\n972,747\n63,284\n979,179\n1069,204\n170,318\n863,166\n214,68\n370,207\n567,544\n930,452\n1220,396\n666,294\n78,115\n20,353\n769,313\n992,367\n1263,228\n965,466\n311,851\n706,280\n1176,309\n141,101\n972,539\n830,638\n726,208\n388,63\n43,614\n1153,263\n920,528\n567,722\n693,464\n634,211\n301,49\n152,491\n967,603\n377,873\n1039,648\n400,828\n1176,217\n425,851\n730,688\n940,511\n1208,0\n793,71\n520,25\n1208,3\n17,60\n1166,791\n480,630\n867,616\n194,113\n574,1\n1054,880\n296,297\n763,353\n945,16\n284,831\n487,886\n808,480\n1149,303\n689,547\n591,162\n649,711\n755,386\n986,502\n502,491\n937,287\n692,625\n1208,782\n1302,591\n1014,821\n949,32\n487,738\n1044,528\n1076,739\n75,296\n768,68\n621,155\n498,682\n472,752\n763,22\n1141,682\n808,801\n1202,124\n910,380\n847,675\n448,586\n641,361\n738,845\n959,739\n502,638\n555,73\n686,302\n457,155\n70,808\n433,380\n487,801\n549,352\n473,540\n1261,469\n599,723\n725,241\n1051,249\n932,504\n1211,546\n1158,86\n1064,395\n604,280\n520,229\n765,768\n348,254\n134,25\n107,353\n266,528\n370,511\n134,309\n666,406\n708,319\n232,490\n1247,120\n561,429\n185,101\n666,854\n1169,549\n728,66\n910,199\n33,9\n1078,490\n1190,679\n676,477\n113,581\n157,39\n919,344\n1241,205\n1195,816\n929,891\n701,103\n545,768\n890,43\n715,381\n493,143\n597,380\n400,179\n249,173\n405,249\n815,617\n10,40\n1141,436\n731,856\n1265,214\n1293,834\n82,843\n1143,290\n552,560\n348,640\n77,764\n837,680\n624,816\n1268,879\n42,15\n853,379\n624,526\n907,380\n753,491\n698,84\n823,456\n244,173\n174,544\n1110,863\n725,689\n874,283\n343,67\n443,616\n564,396\n184,140\n946,255\n463,675\n343,379\n743,172\n967,666\n134,421\n102,891\n1014,750\n102,560\n361,32\n70,584\n812,212\n823,101\n314,740\n634,0\n1213,653\n1203,353\n221,514\n960,31\n821,303\n1144,840\n351,403\n75,676\n864,511\n144,501\n1012,47\n169,682\n421,653\n836,513\n364,255\n1158,310\n634,865\n937,803\n462,553\n1181,500\n1125,59\n156,458\n182,142\n338,600\n380,697\n60,446\n432,423\n438,795\n502,414\n209,180\n1158,491\n937,539\n333,280\n52,217\n720,168\n664,266\n602,319\n403,655\n85,645\n82,624\n383,689\n591,60\n197,394\n972,600\n166,840\n398,14\n674,439\n440,276\n676,211\n85,249\n972,147\n933,693\n1208,508\n184,411\n184,235\n222,350\n1197,581\n249,821\n766,625\n147,299\n574,787\n112,378\n713,514\n1186,383\n1036,697\n344,829\n298,735\n202,263\n567,161\n944,207\n1181,394\n1061,49\n1290,0\n959,179\n1235,604\n785,500\n1029,651\n617,430\n1089,94\n82,185\n837,802\n129,394\n910,715\n28,16\n821,591\n1272,700\n403,768\n33,885\n661,880\n8,591\n1007,851\n179,75\n939,474\n782,191\n1069,297\n18,455\n45,8\n413,697\n636,295\n845,631\n169,884\n166,54\n377,693\n840,235\n1110,479\n892,7\n758,448\n1166,841\n316,40\n1283,572\n1029,103\n338,32\n607,666\n1083,709\n370,84\n815,765\n1014,597\n358,592\n930,890\n500,861\n482,861\n930,157\n52,289\n621,9\n930,442\n731,655\n283,26\n1047,162\n810,460\n636,439\n1093,574\n487,268\n671,68\n513,793\n636,455\n664,714\n771,392\n1258,547\n716,29\n377,201\n447,166\n897,242\n1141,548\n348,701\n386,583\n457,500\n316,862\n954,831\n45,662\n1153,39\n1007,155\n134,869\n736,787\n815,325\n555,508\n882,814\n1020,639\n659,627\n912,238\n1307,828\n611,250\n167,626\n227,709\n1166,53\n994,539\n552,0\n972,152\n1053,840\n1300,256\n13,864\n1220,483\n1011,474\n1071,228\n996,154\n458,565\n298,217\n390,80\n619,14\n758,451\n92,179\n674,743\n249,197\n162,345\n28,607\n324,392\n673,60\n940,810\n1208,675\n102,894\n239,228\n959,403\n617,464\n1076,424\n184,754\n800,375\n1146,549\n924,535\n464,885\n340,350\n711,653\n970,359\n485,234\n1233,130\n27,124\n170,682\n1258,289\n1044,814\n1044,227\n1092,303\n190,280\n1273,464\n77,397\n1125,345\n296,750\n1232,616\n552,891\n167,886\n159,617\n152,819\n541,581\n475,371\n1268,810\n555,386\n433,94\n1000,381\n364,703\n1169,101\n1126,411\n487,156\n1302,303\n509,92\n72,491\n500,33\n1026,383\n500,460\n1225,249\n1126,82\n152,808\n1193,455\n387,605\n1141,458\n1110,703\n708,795\n1198,449\n418,483\n1193,439\n415,666\n274,157\n371,474\n152,577\n425,884\n1310,445\n1058,206\n1257,3\n907,126\n604,154\n344,65\n1293,60\n905,73\n1138,787\n807,756\n462,116\n45,875\n1053,278\n1047,322\n564,498\n27,26\n1202,367\n621,347\n211,144\n63,568\n152,862\n684,719\n172,107\n701,438\n557,491\n441,693\n144,53\n502,577\n800,841\n351,155\n1218,246\n33,459\n775,728\n572,192\n1083,386\n410,621\n626,607\n817,751\n99,348\n453,430\n1021,430\n137,151\n1208,334\n214,618\n590,726\n281,91\n745,458\n933,245\n400,199\n885,851\n266,667\n1119,868\n621,179\n800,519\n157,843\n1103,187\n706,449\n862,308\n298,847\n157,166\n355,891\n1136,190\n817,378\n552,334\n480,544\n728,439\n725,653\n602,249\n75,710\n1233,707\n1014,373\n1154,458\n38,700\n1277,885\n940,207\n637,732\n33,99\n276,1\n701,427\n421,429\n626,399\n671,826\n330,616\n58,535\n1277,435\n913,54\n567,274\n316,355\n933,873\n433,800\n1232,115\n1255,694\n689,459\n234,424\n1143,886\n952,73\n728,828\n169,548\n354,191\n520,869\n1110,31\n1297,30\n808,808\n1197,313\n661,711\n823,178\n38,418\n42,810\n1207,448\n356,735\n190,614\n1225,690\n320,94\n853,842\n1029,551\n1053,502\n569,249\n924,583\n241,652\n552,446\n227,185\n1226,115\n576,616\n910,35\n373,539\n144,151\n470,235\n264,366\n1292,599\n974,815\n711,723\n356,561\n1136,317\n413,380\n298,719\n1220,411\n82,30\n960,863\n16,737\n1158,819\n308,599\n408,499\n266,80\n972,862\n856,703\n1077,689\n487,793\n940,84\n1268,532\n282,434\n626,175\n454,31\n1240,808\n408,173\n500,658\n889,653\n457,52\n837,92\n214,826\n1245,794\n271,648\n649,880\n432,471\n1136,577\n1141,212\n276,292\n77,845\n1233,645\n102,782\n905,821\n436,283\n17,516\n922,528\n485,794\n954,677\n579,655\n1113,394\n1235,676\n686,32\n1074,859\n894,632\n261,794\n221,800\n480,43\n70,310\n393,100\n1174,241\n1282,430\n50,602\n1120,457\n52,677\n853,291\n441,201\n946,348\n659,66\n431,672\n65,100\n790,105\n157,631\n82,621\n311,155\n1131,452\n930,575\n823,793\n790,869\n923,448\n817,826\n1044,334\n738,718\n1131,75\n144,519\n761,542\n474,513\n785,739\n316,712\n405,645\n828,861\n425,43\n1146,345\n277,21\n689,715\n555,521\n959,155\n1258,575\n638,65\n1282,464\n612,810\n800,53\n30,592\n1268,756\n1243,304\n830,256\n848,553\n403,380\n1125,549\n750,404\n1153,843\n126,191\n541,313\n929,443\n365,878\n314,154\n1268,84\n358,816\n185,387\n159,317\n536,191\n331,179\n26,863\n1253,604\n1069,373\n907,768\n144,743\n157,504\n572,718\n1077,465\n1002,599\n743,722\n16,605\n1044,831\n403,318\n774,703\n330,392\n191,26\n495,765\n955,698\n547,200\n1235,744\n1283,26\n397,17\n157,51\n579,38\n1141,234\n27,572\n1077,336\n992,527\n293,480\n410,115\n970,535\n1054,747\n1010,54\n299,420\n913,726\n731,598\n589,346\n738,624\n536,703\n649,14\n296,149\n684,287\n1165,540\n701,456\n694,383\n13,30\n1099,554\n962,701\n321,396\n962,448\n890,760\n1235,150\n793,184\n495,129\n708,249\n967,827\n69,205\n755,508\n103,670\n708,347\n92,627\n420,67\n895,184\n1195,78\n885,205\n293,683\n639,826\n1154,766\n1238,66\n572,633\n348,448\n1073,884\n681,49\n544,625\n1258,347\n1076,515\n793,408\n980,392\n1039,877\n962,640\n436,31\n67,304\n878,423\n823,353\n1232,168\n311,491\n170,212\n463,787\n874,303\n1233,389\n1238,43\n962,483\n889,689\n769,581\n996,740\n621,885\n897,697\n922,35\n1208,219\n582,491\n1272,879\n18,159\n616,252\n1272,476\n689,179\n949,190\n848,789\n380,197\n1186,511\n487,353\n1277,99\n616,511\n311,403\n591,326\n129,603\n267,448\n53,667\n1156,861\n274,737\n708,218\n1053,616\n611,614\n1034,1\n853,52\n1029,91\n197,515\n211,340\n75,666\n281,551\n1004,894\n923,446\n835,554\n351,739\n1143,626\n1037,3\n105,352\n552,448\n482,637\n1277,347\n1131,541\n85,690\n634,894\n618,625\n\nfold along x=655\nfold along y=447\nfold along x=327\nfold along y=223\nfold along x=163\nfold along y=111\nfold along x=81\nfold along y=55\nfold along x=40\nfold along y=27\nfold along y=13\nfold along y=6\n")
```

First we'll write a couple of parsing functions. For the dots, I find
it more natural to think in terms of [row, column] coordinates, so
I'll reverse the order of each tuple.
```clojure
(defn parse-dots [lines]
  (->> lines
       (map #(str/split % #","))
       (map #(vec (reverse (map parse-long %))))))
```

For the folds, we'll map "y" and "x" to the index of the
folding axis; that is, since y indicates a horizontal fold,
i.e. a fold along a row, we'll map it to 0 since "row" is the
0th member of our [row, column] tuples. (This ends up making
the code more concise, which was not obvious to me until
refactoring.)
```clojure
(defn parse-folds [lines]
  (->> lines
       (map #(str/split % #"[= ]"))
       (map (fn [[parse along axis n]]
              [({"y" 0 "x" 1} axis) (parse-long n)]))))
```

And now we'll stitch our two parsing functions together.
```clojure
(defn parse-page [input]
  (let [lines (str/split-lines input)
        [dots _ folds] (->> lines
                            (partition-by #{""})
                            (map #(%1 %2)
                                 [parse-dots identity parse-folds]))]
    [dots folds]))

(def page (parse-page input))
(def t-page (parse-page t-in))
```

Now for the important part: the function that folds up
our paper according to the instructions. We'll write
the function for a single instruction, and then reduce
over the list of instructions.

We're using `axis=0` to indicate a fold along a row, and this
is convenient because it's the 0th member of our `[row, column]`
tuple that we need to update during such a fold; likewise for
folding along a column, where `axis=1`. This means that we don't
need to branch on the axis; we can treat them the same way:
```clojure
(defn fold [dots [axis i]]
  (map (fn [coord]
         (let [n (get coord axis)]
           (if (> n i)
             (assoc coord axis (- i (- n i)))
             coord)))
       dots))
```

Now, since we're first asked to fold the paper just one time,
we'll return all `reductions` over the paper-folds, which will
allow us to examine the paper after 0, 1, ..., n folds.
```clojure
(defn fold-page [[dots folds]]
  (reductions (comp set fold)
              (set dots)
              folds))

(defn part-1 [page]
  (count (second (fold-page page))))

(rcf/tests
  (part-1 page) := 720)
```

Part 2 is fun -- it asks us to make all folds, and then
check which letters are formed by the resulting dots. This
all but requires us to visually chart the dots and examine
them ourselves. (I bet someone out there automated this
step, though.)
```clojure
(defn display-dots [dots]
  (let [size (fn [dots axis-f]
               (inc (reduce max (map axis-f dots))))
        rows (size dots first)
        cols (size dots second)
        blank (vec (repeat rows
                           (vec (repeat cols " "))))
        grid (->> dots
                  (reduce (fn [grid dot]
                            (assoc-in grid dot "*"))
                          blank)
                  (map #(interleave % (repeat " "))))
        lines (map #(apply str %) grid)]
    (str/join \newline lines)))

(defn part-2 [page]
  (display-dots (last (fold-page page))))

(def part-2-expected
  (str/join
    \newline
    ["  * *     *     *   * * *     * * *     * * *       * *     *     *   * * * * "
     "*     *   *     *   *     *   *     *   *     *   *     *   *     *         * "
     "*     *   * * * *   *     *   *     *   *     *   *     *   *     *       *   "
     "* * * *   *     *   * * *     * * *     * * *     * * * *   *     *     *     "
     "*     *   *     *   *         *   *     *         *     *   *     *   *       "
     "*     *   *     *   *         *     *   *         *     *     * *     * * * * "]))

(rcf/tests
  (time (part-2 page)) := part-2-expected)  ; =>  2.281459 ms
```

There was something very satisfying about printing those letters
last night. I don't know if it's the satisfaction of writing code
to visualize a physical-world problem, or if ASCII graphics are
just pleasing to make, or what, but I'm grateful that this puzzle
had the visual element.

⭐️⭐️