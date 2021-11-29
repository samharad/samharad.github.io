---
layout: post
title: Advent of Code 2021 Day 01
draft: true
---
# This is a large heading!
```clojure
(ns aoc.2021.day.01
  (:require [hyperfiddle.rcf :as rcf]))
(rcf/enable!)
```

### This is a smaller heading!

Let's paste the input:
```clojure
(def input "1941\n1887\n1851\n1874\n1612\n1960\n1971\n1983\n1406\n1966\n1554\n1892\n1898\n1926\n1081\n1992\n1073\n1603\n177\n1747\n1063\n1969\n1659\n1303\n1759\n1853\n1107\n1818\n1672\n1352\n2002\n1838\n1985\n1860\n1141\n1903\n1334\n1489\n1178\n1823\n1499\n1951\n1225\n1503\n1417\n1724\n1165\n1339\n1816\n1504\n1588\n1997\n1946\n1324\n1771\n1982\n1272\n1367\n1439\n1252\n1902\n1940\n1333\n1750\n1512\n1538\n1168\n2001\n1797\n1233\n972\n1306\n1835\n1825\n1822\n1880\n1732\n1785\n1727\n1275\n1355\n1793\n1485\n1297\n1932\n1519\n1587\n1382\n1914\n1745\n1087\n1996\n1746\n1962\n1573\n2008\n1868\n1278\n1386\n1238\n1242\n1170\n1476\n1161\n1754\n1807\n1514\n1189\n1916\n1884\n1535\n1217\n1911\n1861\n1493\n1409\n1783\n1222\n1955\n1673\n1502\n607\n2010\n1846\n1819\n1500\n1799\n1475\n1146\n1608\n1806\n1660\n1618\n1904\n978\n1762\n1925\n1185\n1154\n1239\n1843\n1986\n533\n1509\n1913\n287\n1707\n1115\n1699\n1859\n1077\n1915\n1412\n1360\n1646\n1973\n1627\n1755\n1748\n1769\n1886\n1422\n1686\n950\n100\n1372\n1068\n1370\n1428\n1870\n1108\n190\n1891\n1794\n1228\n1128\n1365\n1740\n1888\n1460\n1758\n1906\n1917\n1989\n1251\n1866\n1560\n1921\n1777\n1102\n1850\n1498\n683\n1840\n1800\n1112\n1908\n1442\n1082\n1071")
```

This is plain text (in markdown).
```clojure
; This code-comment documents the code beneath it
(defn foo [] "Hello World!")
(rcf/tests
  (foo) := "Hello World!")
```

#### This is a super small header
```clojure
; And now more code:
(comment
  (println "Hello world!")
  (println "Foo"))
```

More markdown: *emphasis*, ~~strikethrough~~