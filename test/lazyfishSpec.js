#!/usr/bin/env node
var preludeLs, ref$, even, odd, curry, take, lines, words, keys, map, each, join, compact, last, values, x$, fishLib, lazyRange, lazyFind, lazyFilter, lazyReject, lazyList, lazyListOk, lazyScan, lazyScanl, lazyScan1, lazyScanl1, lazyCompact, lazyCompactOk, lazyPartition, lazyHead, lazyTail, lazyTakePartitioned, lazyListEmpty, lazyMap, lazyTake, lazyDrop, lazyWake, lazyWakeOk, lazySplitAt, lazyTakeWhile, lazyDropWhile, lazySpan, lazyLast, lazyLastOk, lazyReverse, lazyUnique, lazyUniqueBy, lazyFold, lazyFoldl, lazyFoldl1, lazyFold1, lazyFoldr, lazyFoldr1, lazyTruncate, lazySlice, lazyMask, lazyDifference, lazyIntersect, lazyConcat, lazyConcatTo, lazyMapConcat, lazyFlatten, lazyCountBy, lazyGroupBy, lazyAndList, lazyOrList, lazyAny, lazyAll, lazySum, lazyProduct, lazyMean, lazyMaximum, lazyMinimum, lazyMaximumBy, lazyMinimumBy, lazyZipTwo, lazyZipTwoWith, lazyZip, lazyZipWith, lazyAt, lazyPick, lazyElemIndices, lazyElemIndex, lazyFindIndices, lazyFindIndex, test, xtest;
ref$ = preludeLs = require('prelude-ls'), even = ref$.even, odd = ref$.odd, curry = ref$.curry, take = ref$.take, lines = ref$.lines, words = ref$.words, keys = ref$.keys, map = ref$.map, each = ref$.each, join = ref$.join, compact = ref$.compact, last = ref$.last, values = ref$.values;
x$ = fishLib = require('fish-lib');
x$.importKind(global, 'all');
ref$ = require('../lazyfish'), lazyRange = ref$.lazyRange, lazyFind = ref$.lazyFind, lazyFilter = ref$.lazyFilter, lazyReject = ref$.lazyReject, lazyList = ref$.lazyList, lazyListOk = ref$.lazyListOk, lazyScan = ref$.lazyScan, lazyScanl = ref$.lazyScanl, lazyScan1 = ref$.lazyScan1, lazyScanl1 = ref$.lazyScanl1, lazyCompact = ref$.lazyCompact, lazyCompactOk = ref$.lazyCompactOk, lazyPartition = ref$.lazyPartition, lazyHead = ref$.lazyHead, lazyTail = ref$.lazyTail, lazyTakePartitioned = ref$.lazyTakePartitioned, lazyListEmpty = ref$.lazyListEmpty, lazyMap = ref$.lazyMap, lazyTake = ref$.lazyTake, lazyDrop = ref$.lazyDrop, lazyWake = ref$.lazyWake, lazyWakeOk = ref$.lazyWakeOk, lazySplitAt = ref$.lazySplitAt, lazyTakeWhile = ref$.lazyTakeWhile, lazyDropWhile = ref$.lazyDropWhile, lazySpan = ref$.lazySpan, lazyLast = ref$.lazyLast, lazyLastOk = ref$.lazyLastOk, lazyReverse = ref$.lazyReverse, lazyUnique = ref$.lazyUnique, lazyUniqueBy = ref$.lazyUniqueBy, lazyFold = ref$.lazyFold, lazyFoldl = ref$.lazyFoldl, lazyFoldl1 = ref$.lazyFoldl1, lazyFold1 = ref$.lazyFold1, lazyFoldr = ref$.lazyFoldr, lazyFoldr1 = ref$.lazyFoldr1, lazyTruncate = ref$.lazyTruncate, lazySlice = ref$.lazySlice, lazyMask = ref$.lazyMask, lazyDifference = ref$.lazyDifference, lazyIntersect = ref$.lazyIntersect, lazyConcat = ref$.lazyConcat, lazyConcatTo = ref$.lazyConcatTo, lazyMapConcat = ref$.lazyMapConcat, lazyFlatten = ref$.lazyFlatten, lazyCountBy = ref$.lazyCountBy, lazyGroupBy = ref$.lazyGroupBy, lazyAndList = ref$.lazyAndList, lazyOrList = ref$.lazyOrList, lazyAny = ref$.lazyAny, lazyAll = ref$.lazyAll, lazySum = ref$.lazySum, lazyProduct = ref$.lazyProduct, lazyMean = ref$.lazyMean, lazyMaximum = ref$.lazyMaximum, lazyMinimum = ref$.lazyMinimum, lazyMaximumBy = ref$.lazyMaximumBy, lazyMinimumBy = ref$.lazyMinimumBy, lazyZipTwo = ref$.lazyZipTwo, lazyZipTwoWith = ref$.lazyZipTwoWith, lazyZip = ref$.lazyZip, lazyZipWith = ref$.lazyZipWith, lazyAt = ref$.lazyAt, lazyPick = ref$.lazyPick, lazyPick = ref$.lazyPick, lazyElemIndices = ref$.lazyElemIndices, lazyElemIndex = ref$.lazyElemIndex, lazyFindIndices = ref$.lazyFindIndices, lazyFindIndex = ref$.lazyFindIndex;
test = it;
xtest = xit;
describe('range', function(){
  test('infinite range', function(){
    var lxs, values;
    lxs = lazyRange(5);
    values = [1, 2, 3, 4, 5].map(function(_){
      var ref$, value, done;
      ref$ = lxs.next(), value = ref$.value, done = ref$.done;
      return value;
    });
    return expect(values).toEqual([5, 6, 7, 8, 9]);
  });
  test('finite range', function(){
    var lxs, values, res$, ref$, value, done;
    lxs = lazyRange(2, 6);
    res$ = [];
    for (;;) {
      ref$ = lxs.next(), value = ref$.value, done = ref$.done;
      if (done) {
        break;
      }
      res$.push(value);
    }
    values = res$;
    return expect(values).toEqual([2, 3, 4, 5, 6]);
  });
  return test('finite range, out of bounds', function(){
    var lxs, values;
    lxs = lazyRange(2, 6);
    values = [1, 2, 3, 4, 5, 6, 7].map(function(_){
      var ref$, value, done;
      ref$ = lxs.next(), value = ref$.value, done = ref$.done;
      return value;
    });
    return expect(values).toEqual([2, 3, 4, 5, 6, void 8, void 8]);
  });
});
describe('wake, take', function(){
  test('lazy-wake', function(){
    return expect(lazyWake(
    function*(){
      (yield 4);
      (yield 5);
      (yield 6);
      return (yield 7);
    }())).toEqual([4, 5, 6, 7]);
  });
  test('lazy-take', function(){
    return expect(lazyTake(3)(
    function*(){
      (yield 4);
      (yield 5);
      (yield 6);
      (yield 7);
      return (yield 8);
    }())).toEqual([4, 5, 6]);
  });
  return test('lazy-take, take too many', function(){
    return expect(lazyTake(4)(
    function*(){
      (yield 4);
      (yield 5);
      return (yield 6);
    }())).toEqual([4, 5, 6]);
  });
});
describe('lazy-drop', function(){
  test('lazy-drop 1', function(){
    return expect(lazyTake(4)(
    lazyDrop(2)(
    lazyRange(5)))).toEqual([7, 8, 9, 10]);
  });
  test('lazy-drop too many', function(){
    return expect(lazyWake(
    lazyDrop(4)(
    lazyRange(5, 7)))).toEqual([]);
  });
  return test('lazy-drop empty', function(){
    return expect(lazyWake(
    lazyDrop(4)(
    lazyListEmpty()))).toEqual([]);
  });
});
describe('wake-ok', function(){
  return test('wake-ok', function(){
    return expect(lazyWakeOk(
    function*(){
      (yield 1);
      (yield 2);
      (yield 4);
      (yield 8);
      return (yield void 8);
    }())).toEqual([1, 2, 4, 8]);
  });
});
describe('lazy-split-at', function(){
  test('1', function(){
    return expect(lazyTake(5)(
    lazySplitAt(3)(
    lazyRange(5)))).toEqual([[5, 6, 7], 8, 9, 10, 11]);
  });
  test('left side empty', function(){
    return expect(lazyTake(6)(
    lazySplitAt(0)(
    lazyRange(5)))).toEqual([[], 5, 6, 7, 8, 9]);
  });
  test('right side empty', function(){
    return expect(lazyWake(
    lazySplitAt(3)(
    lazyRange(5, 7)))).toEqual([[5, 6, 7]]);
  });
  return test('all empty', function(){
    return expect(lazyWake(
    lazySplitAt(2)(
    lazyListEmpty()))).toEqual([[]]);
  });
});
describe('lazy-take-while', function(){
  test('normal', function(){
    return expect(lazyWake(
    lazyTakeWhile((function(it){
      return it % 8;
    }))(
    lazyRange(4)))).toEqual([4, 5, 6, 7]);
  });
  test('empty', function(){
    return expect(lazyWake(
    lazyTakeWhile((function(it){
      return it % 8;
    }))(
    lazyListEmpty()))).toEqual([]);
  });
  return test('never true', function(){
    return expect(lazyWake(
    lazyTakeWhile(function(){
      return false;
    })(
    lazyRange(4)))).toEqual([]);
  });
});
describe('lazy-drop-while', function(){
  test('normal', function(){
    return expect(lazyTake(4)(
    lazyDropWhile((function(it){
      return it < 7;
    }))(
    lazyRange(4)))).toEqual([7, 8, 9, 10]);
  });
  test('empty', function(){
    return expect(lazyWake(
    lazyDropWhile((function(it){
      return it % 8;
    }))(
    lazyListEmpty()))).toEqual([]);
  });
  return test('never true', function(){
    return expect(lazyTake(4)(
    lazyDropWhile(function(){
      return false;
    })(
    lazyRange(4)))).toEqual([4, 5, 6, 7]);
  });
});
describe('map, compact, empty', function(){
  test('map', function(){
    var square;
    square = function(it){
      return it * it;
    };
    return expect(lazyTake(10)(
    lazyMap(square)(
    lazyRange(5)))).toEqual([25, 36, 49, 64, 81, 100, 121, 144, 169, 196]);
  });
  test('compact', function(){
    return expect(lazyTake(5)(
    lazyCompact(
    lazyMap(function(x){
      if (even(x)) {
        return x;
      }
    })(
    lazyRange(1))))).toEqual([2, 4, 6, 8, 10]);
  });
  return test('empty', function(){
    return expect(lazyWake(
    lazyListEmpty())).toEqual([]);
  });
});
describe('lazy-list', function(){
  test('one initial val', function(){
    return expect(lazyTake(5)(
    lazyList(function(val, idx){
      return val * 2;
    })(
    [1]))).toEqual([1, 2, 4, 8, 16]);
  });
  test('two initial vals', function(){
    return expect(lazyTake(8)(
    lazyList(function(a, b){
      return a + b;
    })(
    [1, 1]))).toEqual([1, 1, 2, 3, 5, 8, 13, 21]);
  });
  test('two initial vals and idx', function(){
    return expect(lazyTake(8)(
    lazyList(function(a, b, idx){
      return a + b + idx;
    })(
    [1, 1]))).toEqual([1, 1, 4, 8, 16, 29, 51, 87]);
  });
  return test('two initial vals, shorthand', function(){
    return expect(lazyTake(8)(
    lazyList(curry$(function(x$, y$){
      return x$ + y$;
    }))(
    [1, 1]))).toEqual([1, 1, 2, 3, 5, 8, 13, 21]);
  });
});
describe('wake ok + lazy list', function(){
  return test('wake-ok + lazy list', function(){
    return expect(lazyWakeOk(
    lazyList(function(val, idx){
      if (idx === 6) {
        return;
      }
      return val * 2;
    })(
    [1]))).toEqual([1, 2, 4, 8, 16, 32]);
  });
});
describe('lazy-list-ok', function(){
  test('one initial val', function(){
    return expect(lazyWake(
    lazyListOk(function(val){
      var newVal;
      if (newVal = val - 1) {
        return newVal;
      }
    })(
    [9]))).toEqual([9, 8, 7, 6, 5, 4, 3, 2, 1]);
  });
  test('initial x 2', function(){
    return expect(lazyWake(
    lazyListOk(function(a, b, idx){
      if (idx === 13) {
        return;
      }
      return a + b;
    })(
    [1, 1]))).toEqual([1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233]);
  });
  return test('initial x 2, take too many', function(){
    return expect(lazyTake(8)(
    lazyListOk(function(a, b, idx){
      if (idx === 6) {
        return;
      }
      return a + b;
    })(
    [1, 1]))).toEqual([1, 1, 2, 3, 5, 8]);
  });
});
describe('lazy-scan', function(){
  test('synonym', function(){
    return expect(lazyScan).toEqual(lazyScanl);
  });
  test('lazy-scan', function(){
    return expect(lazyTake(6)(
    lazyScan(curry$(function(x$, y$){
      return x$ + y$;
    }), 3)(
    lazyRange(5)))).toEqual([3, 8, 14, 21, 29, 38]);
  });
  return test('lazy-scan empty substrate', function(){
    return expect(lazyWake(
    lazyScan(curry$(function(x$, y$){
      return x$ + y$;
    }), 3)(
    lazyListEmpty()))).toEqual([3]);
  });
});
describe('lazy-scan1', function(){
  test('synonym', function(){
    return expect(lazyScan1).toEqual(lazyScanl1);
  });
  test('lazy-scan1', function(){
    return expect(lazyTake(6)(
    lazyScan1(curry$(function(x$, y$){
      return x$ + y$;
    }))(
    lazyRange(5)))).toEqual([5, 11, 18, 26, 35, 45]);
  });
  return test('lazy-scan1 single value substrate', function(){
    return expect(lazyWake(
    lazyScan1(curry$(function(x$, y$){
      return x$ + y$;
    }))(
    lazyRange(5, 5)))).toEqual([5]);
  });
});
describe('lazy-reverse', function(){
  test('empty list', function(){
    return expect(lazyWake(
    lazyReverse(
    lazyListEmpty()))).toEqual([]);
  });
  return test('range reverse', function(){
    return expect(lazyTake(3)(
    lazyReverse(
    lazyRange(1, 20)))).toEqual([20, 19, 18]);
  });
});
describe('lazy-unique', function(){
  test('lazy-unique', function(){
    return expect(lazyWake(
    lazyUnique(
    lazyMap((function(it){
      return it % 5;
    }))(
    lazyRange(0, 20))))).toEqual([0, 1, 2, 3, 4]);
  });
  test('lazy-unique-by 1', function(){
    return expect(lazyWake(
    lazyUniqueBy((function(it){
      return it % 5;
    }))(
    lazyRange(0, 20)))).toEqual([0, 1, 2, 3, 4]);
  });
  return test('lazy-unique-by 2', function(){
    return expect(lazyWake(
    lazyUniqueBy(function(it){
      if (odd(it)) {
        return 'blue';
      } else {
        return 'red';
      }
    })(
    lazyRange(0, 20)))).toEqual([0, 1]);
  });
});
describe('lazy-truncate', function(){
  return test('lazy-truncate', function(){
    return expect(lazyWake(
    lazyTruncate(6)(
    lazyRange(0)))).toEqual([0, 1, 2, 3, 4, 5]);
  });
});
describe('lazy-slice', function(){
  test('non empty', function(){
    return expect(lazyWake(
    lazySlice(2, 4)(
    lazyRange(5)))).toEqual([7, 8]);
  });
  return test('empty', function(){
    return expect(lazyWake(
    lazySlice(2, 4)(
    lazyListEmpty()))).toEqual([]);
  });
});
describe('lazy-fold', function(){
  test('synonym', function(){
    return expect(lazyFold).toBe(lazyFoldl);
  });
  test('empty list', function(){
    return expect(lazyFold(curry$(function(x$, y$){
      return x$ + y$;
    }), 10)(
    lazyListEmpty())).toEqual(10);
  });
  test('single element', function(){
    return expect(lazyFold(curry$(function(x$, y$){
      return x$ + y$;
    }), 42)(
    lazyRange(1, 1))).toEqual(43);
  });
  return test('truncate then fold', function(){
    return expect(lazyFold(curry$(function(x$, y$){
      return x$ + y$;
    }), 10)(
    lazyTruncate(6)(
    lazyRange(1)))).toEqual(10 + 1 + 2 + 3 + 4 + 5 + 6);
  });
});
describe('lazy-fold1', function(){
  test('synonym', function(){
    return expect(lazyFold1).toBe(lazyFoldl1);
  });
  test('empty list', function(){
    return expect(lazyFold1(curry$(function(x$, y$){
      return x$ + y$;
    }))(
    lazyListEmpty())).toEqual(void 8);
  });
  test('single element', function(){
    return expect(lazyFold1(curry$(function(x$, y$){
      return x$ + y$;
    }))(
    lazyRange(42, 42))).toEqual(42);
  });
  return test('truncate then fold', function(){
    return expect(lazyFold1(curry$(function(x$, y$){
      return x$ + y$;
    }))(
    lazyTruncate(6)(
    lazyRange(1)))).toEqual(1 + 2 + 3 + 4 + 5 + 6);
  });
});
describe('lazy-foldr', function(){
  test('empty list', function(){
    return expect(lazyFoldr(curry$(function(x$, y$){
      return x$ + y$;
    }), 10)(
    lazyListEmpty())).toEqual(10);
  });
  test('single element', function(){
    return expect(lazyFoldr(curry$(function(x$, y$){
      return x$ + y$;
    }), 10)(
    lazyRange(42, 42))).toEqual(52);
  });
  return test('truncate then fold', function(){
    return expect(lazyFoldr(function(a, b){
      return join('.', [a, b]);
    }, 10)(
    lazyTruncate(6)(
    lazyRange(1)))).toEqual('10.6.5.4.3.2.1');
  });
});
describe('lazy-foldr1', function(){
  test('empty list', function(){
    return expect(lazyFoldr1(curry$(function(x$, y$){
      return x$ + y$;
    }))(
    lazyListEmpty())).toEqual(void 8);
  });
  test('single element', function(){
    return expect(lazyFoldr1(curry$(function(x$, y$){
      return x$ + y$;
    }))(
    lazyRange(42, 42))).toEqual(42);
  });
  return test('truncate then fold', function(){
    return expect(lazyFoldr1(function(a, b){
      return join('.', [a, b]);
    })(
    lazyTruncate(6)(
    lazyRange(1)))).toEqual('6.5.4.3.2.1');
  });
});
describe('filter, reject, partition, take-partitioned', function(){
  test('filter', function(){
    return expect(lazyTake(5)(
    lazyFilter(odd)(
    lazyRange(1)))).toEqual([1, 3, 5, 7, 9]);
  });
  test('reject', function(){
    return expect(lazyTake(5)(
    lazyReject(odd)(
    lazyRange(1)))).toEqual([2, 4, 6, 8, 10]);
  });
  return test('partition', function(){
    expect(lazyTakePartitioned(7)(
    lazyPartition(odd)(
    lazyRange(1)))).toEqual([[1, 3, 5, 7], [2, 4, 6]]);
    return expect(lazyFind(function(it){
      return !(it % 5);
    })(
    lazyRange(6))).toEqual(10);
  });
});
describe('head, tail, last', function(){
  test('head', function(){
    return expect(lazyHead(
    lazyRange(6))).toEqual(6);
  });
  test('head empty', function(){
    return expect(lazyHead(
    lazyListEmpty())).toEqual(void 8);
  });
  test('tail', function(){
    return expect(lazyTake(5)(
    lazyTail(
    lazyRange(6)))).toEqual([7, 8, 9, 10, 11]);
  });
  test('tail empty', function(){
    return expect(lazyWake(
    lazyTail(
    lazyListEmpty()))).toEqual([]);
  });
  test('last 1', function(){
    return expect(lazyLast(
    function*(){
      (yield 1);
      (yield 2);
      (yield 4);
      (yield 8);
      return (yield void 8);
    }())).toEqual(void 8);
  });
  test('last 2', function(){
    return expect(lazyLast(
    lazyListOk(function(val, idx){
      if (idx === 6) {
        return;
      }
      return val * 2;
    })(
    [1]))).toEqual(32);
  });
  test('last empty', function(){
    return expect(lazyLast(
    lazyListOk(function(){})(
    []))).toEqual(void 8);
  });
  test('last ok 1', function(){
    return expect(lazyLastOk(
    function*(){
      (yield 1);
      (yield 2);
      (yield 4);
      (yield 8);
      return (yield void 8);
    }())).toEqual(8);
  });
  return test('last ok 2', function(){
    return expect(lazyLastOk(
    lazyList(function(val, idx){
      if (idx === 6) {
        return;
      }
      return val * 2;
    })(
    [1]))).toEqual(32);
  });
});
describe('lazy-concat', function(){
  test('3 finite', function(){
    return expect(lazyWake(
    lazyConcat(array(lazyRange(1, 4), lazyRange(10, 13), lazyRange(15, 19))))).toEqual([1, 2, 3, 4, 10, 11, 12, 13, 15, 16, 17, 18, 19]);
  });
  return test('2 finite + 1 infinite', function(){
    return expect(lazyTake(13)(
    lazyConcat(array(lazyRange(1, 4), lazyRange(10, 13), lazyRange(15))))).toEqual([1, 2, 3, 4, 10, 11, 12, 13, 15, 16, 17, 18, 19]);
  });
});
describe('lazy-concat-to', function(){
  test('pipeline, 2 finite', function(){
    return expect(lazyWake(
    lazyConcatTo(lazyRange(4, 6))(
    lazyRange(10, 13)))).toEqual([4, 5, 6, 10, 11, 12, 13]);
  });
  return test('pipeline, 1 finite and 1 infinite', function(){
    return expect(lazyTake(9)(
    lazyConcatTo(lazyRange(4, 6))(
    lazyRange(10)))).toEqual([4, 5, 6, 10, 11, 12, 13, 14, 15]);
  });
});
describe('lazy-map-concat', function(){
  test('finite', function(){
    return expect(lazyWake(
    lazyMapConcat(function(x){
      return lazyRange(x, 6);
    })(
    lazyRange(3, 6)))).toEqual([3, 4, 5, 6, 4, 5, 6, 5, 6, 6]);
  });
  return test('infinite', function(){
    return expect(lazyTake(28)(
    lazyMapConcat(function(it){
      return lazyRange(it, 9);
    })(
    lazyRange(3)))).toEqual([3, 4, 5, 6, 7, 8, 9, 4, 5, 6, 7, 8, 9, 5, 6, 7, 8, 9, 6, 7, 8, 9, 7, 8, 9, 8, 9, 9]);
  });
});
describe('lazy-flatten', function(){
  test('depth 1', function(){
    return expect(lazyWake(
    lazyFlatten(
    lazyRange(1, 4)))).toEqual([1, 2, 3, 4]);
  });
  test('depth 2', function(){
    return expect(lazyWake(
    lazyFlatten(
    function*(){
      (yield lazyRange(1, 4));
      return (yield lazyRange(6, 9));
    }()))).toEqual([1, 2, 3, 4, 6, 7, 8, 9]);
  });
  return test('depth 3', function(){
    return expect(lazyWake(
    lazyFlatten(
    function*(){
      (yield function*(){
        (yield lazyRange(1, 4));
        return (yield lazyRange(6, 9));
      }());
      return (yield function*(){
        (yield lazyRange(2, 5));
        return (yield lazyRange(4, 9));
      }());
    }()))).toEqual([1, 2, 3, 4, 6, 7, 8, 9, 2, 3, 4, 5, 4, 5, 6, 7, 8, 9]);
  });
});
describe('lazy-mask', function(){
  test('synonym', function(){
    return expect(lazyMask).toBe(lazyDifference);
  });
  test('empty mask', function(){
    return expect(lazyTake(4)(
    lazyMask([])(
    lazyRange(5)))).toEqual([5, 6, 7, 8]);
  });
  test('empty list', function(){
    return expect(lazyWake(
    lazyMask([2, 3, 4])(
    lazyListEmpty()))).toEqual([]);
  });
  test('empty list and empty mask', function(){
    return expect(lazyWake(
    lazyMask([])(
    lazyListEmpty()))).toEqual([]);
  });
  test('finite, repeated, masked', function(){
    return expect(lazyWake(
    lazyMask([6, 7, 10])(
    function*(){
      (yield 7);
      (yield 7);
      return (yield 7);
    }()))).toEqual([]);
  });
  test('finite, repeated, not masked', function(){
    return expect(lazyWake(
    lazyMask([6, 7, 10])(
    function*(){
      (yield 8);
      (yield 8);
      return (yield 8);
    }()))).toEqual([8, 8, 8]);
  });
  return test('infinite, varied', function(){
    return expect(lazyTake(7)(
    lazyMask([6, 7, 10])(
    lazyRange(5)))).toEqual([5, 8, 9, 11, 12, 13, 14]);
  });
});
describe('lazy-intersect', function(){
  test('empty intersection', function(){
    return expect(lazyIntersect([])(
    function*(){
      (yield 3);
      (yield 2);
      (yield 6);
      return (yield 8);
    }())).toEqual([]);
  });
  test('empty list', function(){
    return expect(lazyIntersect([2, 3, 8])(
    lazyListEmpty())).toEqual([]);
  });
  test('empty intersection and list', function(){
    return expect(lazyIntersect([])(
    lazyListEmpty())).toEqual([]);
  });
  return test('finite, non-empty', function(){
    return expect(lazyWake(
    lazyIntersect([2, 3, 8])(
    function*(){
      (yield 3);
      (yield 2);
      (yield 6);
      (yield 8);
      (yield 4);
      (yield 10);
      return (yield 8);
    }()))).toEqual([3, 2, 8, 8]);
  });
});
describe('lazy-count-by', function(){
  var dog, cat, sheep;
  dog = {
    type: 'mammal',
    woolly: true,
    loyal: true
  };
  cat = {
    type: 'mammal',
    woolly: false,
    loyal: false
  };
  sheep = {
    type: 'mammal',
    woolly: true,
    loyal: false
  };
  test('empty list', function(){
    var counts;
    counts = lazyCountBy(odd)(
    lazyListEmpty());
    return expect(counts.size).toBe(0);
  });
  test('1', function(){
    var counts;
    counts = lazyCountBy(function(it){
      return it.woolly;
    })(
    function*(){
      (yield dog);
      (yield cat);
      (yield dog);
      return (yield sheep);
    }());
    expect(counts.get(true)).toEqual(3);
    return expect(counts.get(false)).toEqual(1);
  });
  return test('2', function(){
    var counts;
    counts = lazyCountBy(function(it){
      return it.type;
    })(
    function*(){
      (yield dog);
      (yield cat);
      (yield dog);
      return (yield sheep);
    }());
    return expect(counts.get('mammal')).toEqual(4);
  });
});
describe('lazy-group-by', function(){
  var dog, cat, sheep;
  dog = {
    type: 'mammal',
    woolly: true,
    loyal: true
  };
  cat = {
    type: 'mammal',
    woolly: false,
    loyal: false
  };
  sheep = {
    type: 'mammal',
    woolly: true,
    loyal: false
  };
  test('empty list', function(){
    var groups;
    groups = lazyGroupBy(odd)(
    lazyListEmpty());
    return expect(groups.size).toBe(0);
  });
  test('1', function(){
    var groups;
    groups = lazyGroupBy(function(it){
      return it.woolly;
    })(
    function*(){
      (yield dog);
      (yield cat);
      (yield dog);
      return (yield sheep);
    }());
    expect(groups.get(true)).toEqual([dog, dog, sheep]);
    return expect(groups.get(false)).toEqual([cat]);
  });
  return test('2', function(){
    var groups;
    groups = lazyGroupBy(function(it){
      return it.type;
    })(
    function*(){
      (yield dog);
      (yield cat);
      (yield dog);
      return (yield sheep);
    }());
    return expect(groups.get('mammal')).toEqual([dog, cat, dog, sheep]);
  });
});
describe('lazy-and-list', function(){
  test('empty list', function(){
    return expect(lazyAndList(
    lazyListEmpty())).toEqual(true);
  });
  test('1', function(){
    return expect(lazyAndList(
    function*(){
      (yield true);
      (yield true);
      return (yield void 8);
    }())).toEqual(false);
  });
  test('2', function(){
    return expect(lazyAndList(
    function*(){
      (yield true);
      return (yield 0);
    }())).toEqual(false);
  });
  return test('3', function(){
    return expect(lazyAndList(
    function*(){
      (yield true);
      return (yield '0');
    }())).toEqual(true);
  });
});
describe('lazy-or-list', function(){
  test('empty list', function(){
    return expect(lazyOrList(
    lazyListEmpty())).toEqual(false);
  });
  test('1', function(){
    return expect(lazyOrList(
    function*(){
      (yield true);
      (yield true);
      return (yield void 8);
    }())).toEqual(true);
  });
  test('2', function(){
    return expect(lazyOrList(
    function*(){
      (yield '0');
      return (yield 0);
    }())).toEqual(true);
  });
  return test('3', function(){
    return expect(lazyOrList(
    function*(){
      (yield 0);
      return (yield null);
    }())).toEqual(false);
  });
});
describe('lazy-any', function(){
  test('empty list', function(){
    return expect(lazyAny(odd)(
    lazyListEmpty())).toEqual(false);
  });
  test('1', function(){
    return expect(lazyAny(odd)(
    function*(){
      (yield 1);
      (yield 2);
      return (yield 3);
    }())).toEqual(true);
  });
  test('2', function(){
    return expect(lazyAny(odd)(
    function*(){
      (yield null);
      return (yield 0);
    }())).toEqual(false);
  });
  return test('3', function(){
    return expect(lazyAny(odd)(
    function*(){
      (yield 0);
      return (yield '0');
    }())).toEqual(false);
  });
});
describe('lazy-all', function(){
  test('empty list', function(){
    return expect(lazyAll(odd)(
    lazyListEmpty())).toEqual(true);
  });
  test('1', function(){
    return expect(lazyAll(odd)(
    function*(){
      (yield 1);
      (yield 2);
      return (yield 3);
    }())).toEqual(false);
  });
  test('2', function(){
    return expect(lazyAll(odd)(
    function*(){
      (yield 1);
      (yield 1);
      return (yield 11);
    }())).toEqual(true);
  });
  return test('3', function(){
    return expect(lazyAll(odd)(
    function*(){
      (yield 1);
      (yield 11);
      return (yield null);
    }())).toEqual(false);
  });
});
describe('lazy-sum', function(){
  test('empty list', function(){
    return expect(lazySum(
    lazyListEmpty())).toEqual(0);
  });
  return test('with truncate', function(){
    return expect(lazySum(
    lazyTruncate(4)(
    lazyRange(5)))).toEqual(26);
  });
});
describe('lazy-product', function(){
  test('empty list', function(){
    return expect(lazyProduct(
    lazyListEmpty())).toEqual(1);
  });
  return test('with truncate', function(){
    return expect(lazyProduct(
    lazyTruncate(3)(
    lazyRange(3)))).toEqual(60);
  });
});
describe('lazy-mean', function(){
  test('empty list', function(){
    return expect(lazyMean(
    lazyListEmpty())).toEqual(void 8);
  });
  return test('1', function(){
    return expect(lazyMean(
    function*(){
      (yield 12);
      (yield 17);
      return (yield 31);
    }())).toEqual(20);
  });
});
describe('lazy-maximum', function(){
  test('empty list', function(){
    return expect(lazyMaximum(
    lazyListEmpty())).toEqual(void 8);
  });
  return test('1', function(){
    return expect(lazyMaximum(
    function*(){
      (yield 12);
      (yield 31.5);
      return (yield 17);
    }())).toEqual(31.5);
  });
});
describe('lazy-minimum', function(){
  test('empty list', function(){
    return expect(lazyMinimum(
    lazyListEmpty())).toEqual(void 8);
  });
  return test('1', function(){
    return expect(lazyMinimum(
    function*(){
      (yield 17);
      (yield 12);
      (yield -10);
      return (yield 31);
    }())).toEqual(-10);
  });
});
describe('lazy-maximum-by', function(){
  test('empty list', function(){
    return expect(lazyMaximumBy(function(){})(
    lazyListEmpty())).toEqual(void 8);
  });
  return test('1', function(){
    return expect(lazyMaximumBy(function(x){
      return x * 2;
    })(
    function*(){
      (yield 12);
      (yield 31.5);
      return (yield 17);
    }())).toEqual(63);
  });
});
describe('lazy-minimum-by', function(){
  test('empty list', function(){
    return expect(lazyMinimumBy(function(){})(
    lazyListEmpty())).toEqual(void 8);
  });
  return test('1', function(){
    return expect(lazyMinimumBy(function(x){
      return x - 5;
    })(
    function*(){
      (yield 17);
      (yield 12);
      (yield -10);
      return (yield 31);
    }())).toEqual(-15);
  });
});
describe('lazy-zip-two', function(){
  test('normal', function(){
    return expect(lazyTake(4)(
    lazyZipTwo(lazyRange(1), lazyRange(10)))).toEqual([[1, 10], [2, 11], [3, 12], [4, 13]]);
  });
  test('curried', function(){
    return expect(lazyTake(4)(
    lazyZipTwo(lazyRange(1))(
    lazyRange(10)))).toEqual([[1, 10], [2, 11], [3, 12], [4, 13]]);
  });
  test('left empty', function(){
    return expect(lazyTake(4)(
    lazyZipTwo(lazyListEmpty(), lazyRange(10)))).toEqual([]);
  });
  test('right empty', function(){
    return expect(lazyTake(4)(
    lazyZipTwo(lazyRange(1), lazyListEmpty()))).toEqual([]);
  });
  test('both empty', function(){
    return expect(lazyTake(4)(
    lazyZipTwo(lazyListEmpty(), lazyListEmpty()))).toEqual([]);
  });
  return test('different sizes', function(){
    return expect(lazyWake(
    lazyZipTwo(lazyRange(1, 4), lazyRange(10)))).toEqual([[1, 10], [2, 11], [3, 12], [4, 13]]);
  });
});
describe('lazy-zip-two-with', function(){
  test('normal', function(){
    return expect(lazyTake(4)(
    lazyZipTwoWith(curry$(function(x$, y$){
      return x$ + y$;
    }), lazyRange(1), lazyRange(10)))).toEqual([11, 13, 15, 17]);
  });
  test('curried', function(){
    return expect(lazyTake(4)(
    lazyZipTwoWith(curry$(function(x$, y$){
      return x$ + y$;
    }), lazyRange(1))(
    lazyRange(10)))).toEqual([11, 13, 15, 17]);
  });
  test('left empty', function(){
    return expect(lazyTake(4)(
    lazyZipTwoWith(curry$(function(x$, y$){
      return x$ + y$;
    }), lazyListEmpty(), lazyRange(10)))).toEqual([]);
  });
  test('right empty', function(){
    return expect(lazyTake(4)(
    lazyZipTwoWith(curry$(function(x$, y$){
      return x$ + y$;
    }), lazyRange(1), lazyListEmpty()))).toEqual([]);
  });
  test('both empty', function(){
    return expect(lazyTake(4)(
    lazyZipTwoWith(curry$(function(x$, y$){
      return x$ + y$;
    }), lazyListEmpty(), lazyListEmpty()))).toEqual([]);
  });
  return test('different sizes', function(){
    return expect(lazyWake(
    lazyZipTwoWith(curry$(function(x$, y$){
      return x$ * y$;
    }), lazyRange(1, 4), lazyRange(10)))).toEqual([10, 22, 36, 52]);
  });
});
describe('lazy-zip', function(){
  test('normal', function(){
    return expect(lazyTake(4)(
    lazyZip(lazyRange(1), lazyRange(10), lazyRange(20)))).toEqual([[1, 10, 20], [2, 11, 21], [3, 12, 22], [4, 13, 23]]);
  });
  test('2 empty', function(){
    return expect(lazyWake(
    lazyZip(lazyListEmpty(), lazyListEmpty(), lazyRange(10)))).toEqual([]);
  });
  test('1 empty', function(){
    return expect(lazyWake(
    lazyZip(lazyRange(1), lazyListEmpty(), lazyRange(1)))).toEqual([]);
  });
  test('3 empty', function(){
    return expect(lazyWake(
    lazyZip(lazyListEmpty(), lazyListEmpty(), lazyListEmpty()))).toEqual([]);
  });
  return test('different sizes', function(){
    return expect(lazyWake(
    lazyZip(lazyRange(1, 4), lazyRange(10), lazyRange(2, 6)))).toEqual([[1, 10, 2], [2, 11, 3], [3, 12, 4], [4, 13, 5]]);
  });
});
describe('lazy-zip-with', function(){
  test('normal', function(){
    return expect(lazyTake(4)(
    lazyZipWith(function(a, b, c){
      return a + b + c;
    }, lazyRange(1), lazyRange(10), lazyRange(20)))).toEqual([31, 34, 37, 40]);
  });
  test('2 empty', function(){
    return expect(lazyWake(
    lazyZipWith(function(a, b, c){
      return a + b + c;
    }, lazyListEmpty(), lazyListEmpty(), lazyRange(10)))).toEqual([]);
  });
  test('1 empty', function(){
    return expect(lazyWake(
    lazyZipWith(function(a, b, c){
      return a + b + c;
    }, lazyRange(1), lazyListEmpty(), lazyRange(1)))).toEqual([]);
  });
  test('3 empty', function(){
    return expect(lazyWake(
    lazyZipWith(function(a, b, c){
      return a + b + c;
    }, lazyListEmpty(), lazyListEmpty(), lazyListEmpty()))).toEqual([]);
  });
  return test('different sizes', function(){
    return expect(lazyWake(
    lazyZipWith(function(a, b, c){
      return a + b + c;
    }, lazyRange(1, 4), lazyRange(10), lazyRange(2, 6)))).toEqual([13, 16, 19, 22]);
  });
});
describe('lazy-at', function(){
  test('synonynm', function(){
    return expect(lazyAt).toBe(lazyPick);
  });
  test('fibonacci(34) (0-based)', function(){
    return expect(lazyAt(33)(
    lazyList(curry$(function(x$, y$){
      return x$ + y$;
    }))(
    [1, 1]))).toEqual(5702887);
  });
  test('normal', function(){
    return expect(lazyAt(3)(
    lazyRange(4))).toEqual(7);
  });
  test('invalid', function(){
    return expect(lazyAt(3)(
    lazyRange(4, 5))).toEqual(void 8);
  });
  return test('empty', function(){
    return expect(lazyAt(3)(
    lazyListEmpty())).toEqual(void 8);
  });
});
describe('lazy-elem-indices', function(){
  test('normal', function(){
    return expect(lazyElemIndices(4)(
    function*(){
      (yield 4);
      (yield 5);
      (yield 4);
      return (yield 6);
    }())).toEqual([0, 2]);
  });
  test('not there', function(){
    return expect(lazyElemIndices(10)(
    function*(){
      (yield 4);
      (yield 5);
      (yield 4);
      return (yield 6);
    }())).toEqual([]);
  });
  return test('empty', function(){
    return expect(lazyElemIndices(10)(
    lazyListEmpty())).toEqual([]);
  });
});
describe('lazy-elem-index', function(){
  test('normal', function(){
    return expect(lazyElemIndex(5)(
    function*(){
      (yield 4);
      (yield 5);
      (yield 4);
      return (yield 6);
    }())).toEqual(1);
  });
  test('duplicate', function(){
    return expect(lazyElemIndex(4)(
    function*(){
      (yield 4);
      (yield 5);
      (yield 4);
      return (yield 6);
    }())).toEqual(0);
  });
  test('not there', function(){
    return expect(lazyElemIndex(10)(
    function*(){
      (yield 4);
      (yield 5);
      (yield 4);
      return (yield 6);
    }())).toEqual(void 8);
  });
  return test('empty', function(){
    return expect(lazyElemIndex(10)(
    lazyListEmpty())).toEqual(void 8);
  });
});
describe('lazy-find-indices', function(){
  test('normal', function(){
    return expect(lazyFindIndices(even)(
    function*(){
      (yield 4);
      (yield 5);
      (yield 4);
      return (yield 6);
    }())).toEqual([0, 2, 3]);
  });
  test('not there', function(){
    return expect(lazyFindIndices(odd)(
    function*(){
      (yield 4);
      (yield 8);
      (yield 4);
      return (yield 6);
    }())).toEqual([]);
  });
  return test('empty', function(){
    return expect(lazyFindIndices(even)(
    lazyListEmpty())).toEqual([]);
  });
});
describe('lazy-find-index', function(){
  test('normal', function(){
    return expect(lazyFindIndex(even)(
    function*(){
      (yield 4);
      (yield 5);
      (yield 7);
      return (yield 9);
    }())).toEqual(0);
  });
  test('duplicate', function(){
    return expect(lazyFindIndex(even)(
    function*(){
      (yield 4);
      (yield 5);
      (yield 4);
      return (yield 6);
    }())).toEqual(0);
  });
  test('not there', function(){
    return expect(lazyFindIndex(odd)(
    function*(){
      (yield 4);
      (yield 8);
      (yield 4);
      return (yield 6);
    }())).toEqual(void 8);
  });
  return test('empty', function(){
    return expect(lazyFindIndex(even)(
    lazyListEmpty())).toEqual(void 8);
  });
});
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