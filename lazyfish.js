var preludeLs, ref$, take, curry, lines, words, keys, map, each, join, compact, last, values, error, isObject, lazyRange, lazyMap, lazyCompactOk, lazyCompact, lazyListEmpty, lazyListPriv, lazyList, lazyListOk, lazyScan, lazyScanl, lazyScan1, lazyScanl1, lazyFilter, lazyReject, lazyPartition, lazyTakePartitioned, lazyTake, lazyDrop, lazyWake, lazyWakeOk, lazySplitAt, lazyTakeWhile, lazyDropWhile, lazyFind, lazyHead, lazyTail, lazyLast, lazyLastOk, lazyReverse, lazyUniqueBy, lazyUnique, lazyTruncate, lazySlice, lazyFold, lazyFoldl, lazyFold1, lazyFoldl1, lazyFoldr, lazyFoldr1, lazyConcat, lazyConcatTo, lazyMapConcat, lazyFlatten, lazyMask, lazyDifference, lazyIntersect, lazyCountBy, lazyGroupBy, lazyAndList, lazyOrList, lazyAny, lazyAll, lazyMean, lazyMaximum, lazyMinimum, lazyMaximumBy, lazyMinimumBy, lazySum, lazyProduct, lazyZip, lazyZipWith, lazyZipTwo, lazyZipTwoWith, lazyAt, lazyPick, lazyElemIndices, lazyElemIndex, lazyFindIndices, lazyFindIndex, slice$ = [].slice, out$ = typeof exports != 'undefined' && exports || this;
ref$ = preludeLs = require('prelude-ls'), take = ref$.take, curry = ref$.curry, lines = ref$.lines, words = ref$.words, keys = ref$.keys, map = ref$.map, each = ref$.each, join = ref$.join, compact = ref$.compact, last = ref$.last, values = ref$.values;
ref$ = require('fish-lib'), error = ref$.error, isObject = ref$.isObject;
lazyRange = function*(a, b){
  var i$, i;
  b == null && (b = Infinity);
  for (i$ = a; i$ <= b; ++i$) {
    i = i$;
    (yield i);
  }
};
lazyMap = curry$(function*(f, lxs){
  var ref$, value, done;
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    (yield f(value));
  }
});
lazyCompactOk = function*(lxs){
  var ref$, value, done;
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    if (value == null) {
      continue;
    }
    (yield value);
  }
};
lazyCompact = function*(lxs){
  var ref$, value, done;
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    if (!value) {
      continue;
    }
    (yield value);
  }
};
lazyListEmpty = function*(){};
lazyListPriv = function*(f, initial, opts){
  var numTails, tailValues, idx, okMode, i$, len$, val, cur, x$;
  opts == null && (opts = {});
  numTails = void 8;
  tailValues = [];
  idx = 0;
  okMode = opts.okMode;
  numTails = initial.length;
  for (i$ = 0, len$ = initial.length; i$ < len$; ++i$) {
    val = initial[i$];
    tailValues.push(val);
    idx = idx + 1;
    (yield val);
  }
  for (;;) {
    cur = f.apply(null, tailValues.concat([idx]));
    if (okMode) {
      if (cur == null) {
        return;
      }
    }
    x$ = tailValues;
    x$.shift();
    x$.push(cur);
    idx = idx + 1;
    (yield cur);
  }
};
lazyList = curry$(function(f, initial){
  return lazyListPriv.apply(null, [f, initial]);
});
lazyListOk = curry$(function(f, initial){
  return lazyListPriv.apply(null, [
    f, initial, {
      okMode: true
    }
  ]);
});
lazyScan = lazyScanl = curry$(function*(f, initial, lxs){
  var prevVal, ref$, value, done, val;
  (yield initial);
  prevVal = initial;
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    val = f.call(null, prevVal, value);
    (yield val);
    prevVal = val;
  }
});
lazyScan1 = lazyScanl1 = curry$(function*(f, lxs){
  var ref$, value, done, prevVal, val;
  ref$ = lxs.next(), value = ref$.value, done = ref$.done;
  (yield value);
  prevVal = value;
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    val = f.call(null, prevVal, value);
    (yield val);
    prevVal = val;
  }
});
lazyFilter = curry$(function*(f, lxs){
  var ref$, value, done;
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    if (f(value)) {
      (yield value);
    }
  }
});
lazyReject = curry$(function*(f, lxs){
  var ref$, value, done;
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    if (!f(value)) {
      (yield value);
    }
  }
});
lazyPartition = curry$(function*(f, lxs){
  var ref$, value, done;
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    (yield {
      value: value,
      passed: f(value) ? true : false
    });
  }
});
lazyTakePartitioned = curry$(function(n, lxs){
  var passed, rejected, i$, to$, i, ref$, value, done, itPassed;
  passed = [];
  rejected = [];
  for (i$ = 0, to$ = n - 1; i$ <= to$; ++i$) {
    i = i$;
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      return;
    }
    ref$ = value, value = ref$.value, itPassed = ref$.passed;
    (itPassed ? passed : rejected).push(value);
  }
  return [passed, rejected];
});
lazyTake = curry$(function(n, lxs){
  var ret, i$, to$, i, ref$, value, done;
  n == null && (n = Infinity);
  ret = [];
  for (i$ = 0, to$ = n - 1; i$ <= to$; ++i$) {
    i = i$;
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      return ret;
    }
    ret.push(value);
  }
  return ret;
});
lazyDrop = curry$(function*(n, lxs){
  var i$, to$, i, ref$, value, done;
  for (i$ = 0, to$ = n - 1; i$ <= to$; ++i$) {
    i = i$;
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
  }
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    (yield value);
  }
});
lazyWake = function(lxs){
  return lazyTake(void 8, lxs);
};
lazyWakeOk = function(lxs){
  var ret, ref$, value, done;
  ret = [];
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done || value == null) {
      break;
    }
    ret.push(value);
  }
  return ret;
};
lazySplitAt = curry$(function*(n, lxs){
  (yield lazyTake(n, lxs));
  yield* lxs;
});
lazyTakeWhile = curry$(function*(f, lxs){
  var ref$, value, done;
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    if (!f(value)) {
      return;
    }
    (yield value);
  }
});
lazyDropWhile = curry$(function*(f, lxs){
  var ref$, value, done;
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    if (f(value)) {
      continue;
    }
    (yield value);
  }
});
lazyFind = curry$(function(f, lxs){
  var ref$, value, done;
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    if (f(value)) {
      return value;
    }
  }
});
lazyHead = function(lxs){
  return lxs.next().value;
};
lazyTail = function*(lxs){
  var ref$, value, done;
  if (lxs.next().done) {
    return;
  }
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    (yield value);
  }
};
lazyLast = function(lxs){
  var prev, ref$, value, done;
  prev = void 8;
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      return prev;
    }
    prev = value;
  }
};
lazyLastOk = function(lxs){
  var prev, ref$, value, done;
  prev = void 8;
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    if (prev != null && value == null) {
      return prev;
    }
    prev = value;
  }
};
lazyReverse = function*(lxs){
  var i$, ref$, len$, i;
  for (i$ = 0, len$ = (ref$ = lazyWake(lxs).reverse()).length; i$ < len$; ++i$) {
    i = ref$[i$];
    (yield i);
  }
};
lazyUniqueBy = curry$(function*(f, lxs){
  var uniqueFuncVals, uniqueListVals, ref$, value, done, funcValue, i$, len$, i;
  uniqueFuncVals = new Set;
  uniqueListVals = [];
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    funcValue = f(value);
    if (done) {
      break;
    }
    if (uniqueFuncVals.has(funcValue)) {
      continue;
    }
    uniqueFuncVals.add(funcValue);
    uniqueListVals.push(value);
  }
  for (i$ = 0, len$ = uniqueListVals.length; i$ < len$; ++i$) {
    i = uniqueListVals[i$];
    (yield i);
  }
});
lazyUnique = function(lxs){
  return lazyUniqueBy(function(it){
    return it;
  }, lxs);
};
lazyTruncate = curry$(function*(n, lxs){
  var i$, to$, i, ref$, value, done;
  for (i$ = 0, to$ = n - 1; i$ <= to$; ++i$) {
    i = i$;
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      return;
    }
    (yield value);
  }
});
lazySlice = curry$(function*(a, b, lxs){
  var i$, to$, i, ref$, value, done;
  for (i$ = 0, to$ = b - 1; i$ <= to$; ++i$) {
    i = i$;
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    if (!(i >= a)) {
      continue;
    }
    (yield value);
  }
});
lazyFold = lazyFoldl = curry$(function(f, initial, lxs){
  var result, ref$, value, done;
  result = initial;
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    result = f(result, value);
  }
  return result;
});
lazyFold1 = lazyFoldl1 = curry$(function(f, lxs){
  var ref$, value, done, result;
  ref$ = lxs.next(), value = ref$.value, done = ref$.done;
  result = value;
  if (done) {
    return result;
  }
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    result = f(result, value);
  }
  return result;
});
lazyFoldr = curry$(function(f, initial, lxs){
  var result, rlxs, ref$, value, done;
  result = initial;
  rlxs = lazyReverse(lxs);
  for (;;) {
    ref$ = rlxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    result = f(result, value);
  }
  return result;
});
lazyFoldr1 = curry$(function(f, lxs){
  var rlxs, ref$, value, done, result;
  rlxs = lazyReverse(lxs);
  ref$ = rlxs.next(), value = ref$.value, done = ref$.done;
  result = value;
  if (done) {
    return result;
  }
  for (;;) {
    ref$ = rlxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    result = f(result, value);
  }
  return result;
});
lazyConcat = function*(lxss){
  var i$, len$, lxs, ref$, value, done;
  for (i$ = 0, len$ = lxss.length; i$ < len$; ++i$) {
    lxs = lxss[i$];
    for (;;) {
      ref$ = lxs.next(), value = ref$.value, done = ref$.done;
      if (done) {
        break;
      }
      (yield value);
    }
  }
};
lazyConcatTo = curry$(function(lxsLeft, lxsRight){
  return lazyConcat([lxsLeft, lxsRight]);
});
lazyMapConcat = curry$(function*(f, lxs){
  var mxs, ref$, value, done, valueInner, doneInner;
  mxs = lazyMap(f, lxs);
  for (;;) {
    ref$ = mxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    for (;;) {
      ref$ = value.next(), valueInner = ref$.value, doneInner = ref$.done;
      if (doneInner) {
        break;
      }
      (yield valueInner);
    }
  }
});
lazyFlatten = function*(lxs){
  var ref$, value, done, nextFunc;
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      return;
    }
    if ((nextFunc = value.next) && isFunction(nextFunc)) {
      yield* lazyFlatten(value);
    } else {
      (yield value);
    }
  }
};
lazyMask = lazyDifference = curry$(function*(maskAry, lxs){
  var maskSet, ref$, value, done;
  maskSet = new Set(maskAry);
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    if (maskSet.has(value)) {
      continue;
    }
    (yield value);
  }
});
lazyIntersect = curry$(function*(intersectVals, lxs){
  var intersectSet, ref$, value, done;
  intersectSet = new Set(intersectVals);
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    if (!intersectSet.has(value)) {
      continue;
    }
    (yield value);
  }
});
lazyCountBy = curry$(function(f, lxs){
  var counts, ref$, value, done, result, cnt;
  counts = new Map;
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    result = f(value);
    if (cnt = counts.get(result)) {
      counts.set(result, cnt + 1);
    } else {
      counts.set(result, 1);
    }
  }
  return counts;
});
lazyGroupBy = curry$(function(f, lxs){
  var groups, ref$, value, done, result, list;
  groups = new Map;
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    result = f(value);
    if (list = groups.get(result)) {
      list.push(value);
    } else {
      groups.set(result, [value]);
    }
  }
  return groups;
});
lazyAndList = function(lxs){
  var ref$, value, done;
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    if (!value) {
      return false;
    }
  }
  return true;
};
lazyOrList = function(lxs){
  var ref$, value, done;
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    if (value) {
      return true;
    }
  }
  return false;
};
lazyAny = curry$(function(f, lxs){
  var ref$, value, done;
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    if (f(value)) {
      return true;
    }
  }
  return false;
});
lazyAll = curry$(function(f, lxs){
  var ref$, value, done;
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    if (!f(value)) {
      return false;
    }
  }
  return true;
});
lazyMean = function(lxs){
  var sum, count, ref$, value, done;
  sum = 0;
  count = 0;
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    count += 1;
    sum += value;
  }
  if (count) {
    return sum / count;
  } else {}
};
lazyMaximum = function(lxs){
  var cur, ref$, value, done;
  cur = void 8;
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    if (cur == null || value > cur) {
      cur = value;
    }
  }
  return cur;
};
lazyMinimum = function(lxs){
  var cur, ref$, value, done;
  cur = void 8;
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    if (cur == null || value < cur) {
      cur = value;
    }
  }
  return cur;
};
lazyMaximumBy = curry$(function(f, lxs){
  var cur, ref$, value, done, result;
  cur = void 8;
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    result = f(value);
    if (cur == null || result > cur) {
      cur = result;
    }
  }
  return cur;
});
lazyMinimumBy = curry$(function(f, lxs){
  var cur, ref$, value, done, result;
  cur = void 8;
  for (;;) {
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    result = f(value);
    if (cur == null || result < cur) {
      cur = result;
    }
  }
  return cur;
});
lazySum = function(lxs){
  return lazyFold(curry$(function(x$, y$){
    return x$ + y$;
  }), 0, lxs);
};
lazyProduct = function(lxs){
  return lazyFold(curry$(function(x$, y$){
    return x$ * y$;
  }), 1, lxs);
};
lazyZip = function*(){
  var lxss, vals, i$, len$, lxs, ref$, value, done;
  lxss = slice$.call(arguments);
  outer: for (;;) {
    vals = [];
    for (i$ = 0, len$ = lxss.length; i$ < len$; ++i$) {
      lxs = lxss[i$];
      ref$ = lxs.next(), value = ref$.value, done = ref$.done;
      if (done) {
        break outer;
      }
      vals.push(value);
    }
    (yield vals);
  }
};
lazyZipWith = function*(f){
  var lxss, vals, i$, len$, lxs, ref$, value, done;
  lxss = slice$.call(arguments, 1);
  outer: for (;;) {
    vals = [];
    for (i$ = 0, len$ = lxss.length; i$ < len$; ++i$) {
      lxs = lxss[i$];
      ref$ = lxs.next(), value = ref$.value, done = ref$.done;
      if (done) {
        break outer;
      }
      vals.push(value);
    }
    (yield f.apply(null, vals));
  }
};
lazyZipTwo = curry$(function(lxs, rxs){
  return lazyZip.call(null, lxs, rxs);
});
lazyZipTwoWith = curry$(function(f, lxs, rxs){
  return lazyZipWith.call(null, f, lxs, rxs);
});
lazyAt = lazyPick = curry$(function(n, lxs){
  var i$, to$, i, ref$, value, done;
  for (i$ = 0, to$ = n - 1; i$ <= to$; ++i$) {
    i = i$;
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
  }
  ref$ = lxs.next(), value = ref$.value, done = ref$.done;
  return value;
});
lazyElemIndices = curry$(function(el, lxs){
  var idx, ref$, value, done, results$ = [];
  idx = -1;
  for (;;) {
    idx = idx + 1;
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    if (value !== el) {
      continue;
    }
    results$.push(idx);
  }
  return results$;
});
lazyElemIndex = curry$(function(el, lxs){
  return lazyElemIndices.apply(this, arguments).shift();
});
lazyFindIndices = curry$(function(f, lxs){
  var idx, ref$, value, done, results$ = [];
  idx = -1;
  for (;;) {
    idx = idx + 1;
    ref$ = lxs.next(), value = ref$.value, done = ref$.done;
    if (done) {
      break;
    }
    if (!f(value)) {
      continue;
    }
    results$.push(idx);
  }
  return results$;
});
lazyFindIndex = curry$(function(f, lxs){
  return lazyFindIndices.apply(this, arguments).shift();
});
out$.lazyMap = lazyMap;
out$.lazyRange = lazyRange;
out$.lazyTake = lazyTake;
out$.lazyDrop = lazyDrop;
out$.lazyWake = lazyWake;
out$.lazyWakeOk = lazyWakeOk;
out$.lazySplitAt = lazySplitAt;
out$.lazyTakeWhile = lazyTakeWhile;
out$.lazyDropWhile = lazyDropWhile;
out$.lazyCompact = lazyCompact;
out$.lazyCompactOk = lazyCompactOk;
out$.lazyListEmpty = lazyListEmpty;
out$.lazyList = lazyList;
out$.lazyListOk = lazyListOk;
out$.lazyScan = lazyScan;
out$.lazyScanl = lazyScanl;
out$.lazyScan1 = lazyScan1;
out$.lazyScanl1 = lazyScanl1;
out$.lazyFilter = lazyFilter;
out$.lazyReject = lazyReject;
out$.lazyPartition = lazyPartition;
out$.lazyTakePartitioned = lazyTakePartitioned;
out$.lazyFind = lazyFind;
out$.lazyHead = lazyHead;
out$.lazyTail = lazyTail;
out$.lazyLast = lazyLast;
out$.lazyLastOk = lazyLastOk;
out$.lazyReverse = lazyReverse;
out$.lazyConcat = lazyConcat;
out$.lazyConcatTo = lazyConcatTo;
out$.lazyFold = lazyFold;
out$.lazyFoldl = lazyFoldl;
out$.lazyFold1 = lazyFold1;
out$.lazyFoldl1 = lazyFoldl1;
out$.lazyFoldr = lazyFoldr;
out$.lazyFoldr1 = lazyFoldr1;
out$.lazyTruncate = lazyTruncate;
out$.lazySlice = lazySlice;
out$.lazyUnique = lazyUnique;
out$.lazyUniqueBy = lazyUniqueBy;
out$.lazyConcat = lazyConcat;
out$.lazyConcatTo = lazyConcatTo;
out$.lazyMapConcat = lazyMapConcat;
out$.lazyFlatten = lazyFlatten;
out$.lazyMask = lazyMask;
out$.lazyDifference = lazyDifference;
out$.lazyIntersect = lazyIntersect;
out$.lazyCountBy = lazyCountBy;
out$.lazyGroupBy = lazyGroupBy;
out$.lazyAndList = lazyAndList;
out$.lazyOrList = lazyOrList;
out$.lazyAny = lazyAny;
out$.lazyAll = lazyAll;
out$.lazySum = lazySum;
out$.lazyProduct = lazyProduct;
out$.lazyMean = lazyMean;
out$.lazyMaximum = lazyMaximum;
out$.lazyMinimum = lazyMinimum;
out$.lazyMaximumBy = lazyMaximumBy;
out$.lazyMinimumBy = lazyMinimumBy;
out$.lazyZip = lazyZip;
out$.lazyZipWith = lazyZipWith;
out$.lazyZipTwo = lazyZipTwo;
out$.lazyZipTwoWith = lazyZipTwoWith;
out$.lazyAt = lazyAt;
out$.lazyPick = lazyPick;
out$.lazyElemIndex = lazyElemIndex;
out$.lazyElemIndices = lazyElemIndices;
out$.lazyFindIndex = lazyFindIndex;
out$.lazyFindIndices = lazyFindIndices;
function curry$(f, bound){
  var context,
  _curry = function(args) {
    return f.length > 1 ? function(){
      var params = args ? args.concat() : [];
      context = bound ? context || this : this;
      return params.push.apply(params, arguments) <
          f.length && arguments.length ?
        _curry.call(context, params) : f.apply(context, params);
    } : f;
  };
  return _curry();
}