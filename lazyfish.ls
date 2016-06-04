# prelude notes:
#
# compact doesn't need to be curried.
# flatten also doesn't.
# count-by: coerces equality, surprising. (results[key])
#
# shouldn't tail of an empty list return an empty list? check clojure. XX
# my unique.
# concat-to.


{ take, curry, lines, words, keys, map, each, join, compact, last, values, } = prelude-ls = require 'prelude-ls'

{ error, is-object, } = require 'fish-lib'

lazy-range = (a, b = Infinity) ->*
    [yield i for i from a to b]
    void

lazy-map = (f, lxs) -->*
    while true
        { value, done, } = lxs.next()
        break if done
        yield f value
    void

lazy-compact-ok = (lxs) ->*
    while true
        { value, done, } = lxs.next()
        break if done
        continue unless value?
        yield value
    void

lazy-compact = (lxs) ->*
    while true
        { value, done, } = lxs.next()
        break if done
        continue unless value
        yield value
    void

lazy-list-empty = ->*
    return

# --- generate a list using initial value(s) and a function.
#
# let n be the length of initial.
#
# after the initial values have been returned, each successive iteration
# will return the function f called with n previous values and the current
# idx.
#
# --- examples:
#
# lazy-list 1 (val, idx) -> val * 2
#   => [1 2 3 8 16 ...]
#
# lazy-list [1] (val, idx) -> val * 2
#   => same
#
# lazy-list [x y z] f
#   => [x y z f(x, y, z, 3) f(y, z, f(x, y, z, 3), 4) ...]

lazy-list-priv = (f, initial, opts = {}) ->*
    num-tails = void
    tail-values = []
    idx = 0

    { ok-mode, } = opts

    num-tails = initial.length

    for val in initial
        tail-values.push val
        idx = idx + 1
        yield val

    while true
        cur = f.apply null tail-values ++ [idx]
        if ok-mode
            return unless cur?
        tail-values
            ..shift()
            ..push cur
        idx = idx + 1
        yield cur

# --- lazy-list and lazy-list-ok should be thought of as generators, though
# they actually just route through lazy-list-priv and are thus normal
# functions.

lazy-list = (f, initial) -->
    lazy-list-priv.apply null [f, initial]

# --- truncate list at first null/undefined.
lazy-list-ok = (f, initial) -->
    lazy-list-priv.apply null [f, initial, ok-mode: true]


# --- similiar to lazy-list, except that it takes intermediate values as
# well as initial ones, and the function must be binary.
#
# unlike in lazy-list, the function is called on every single iteration, and
# the initial value(s) is/are only used for the first returned entry.
#
# rather like 'reduce' in many languages.
#
# e.g.:
#
# lazy-range 5
# |> lazy-scan do
#   (a, b, idx) -> a + b
#   3
#
# => [8 14 22 ...]
#
# as with lazy-list you can easily ignore the idx param:
#
# lazy-range 5
# |> lazy-scan (+), 3
#
# => [8 14 22 ...]
#
# we do not currently provide a variant on list/scan in which the iterated
# value is different from the value which gets returned in the list (like
# prelude's unfoldr for example).

lazy-scan = lazy-scanl = (f, initial, lxs) -->*
    yield initial
    prev-val = initial
    while true
        { value, done, } = lxs.next()
        break if done
        val = f.call null prev-val, value
        yield val
        prev-val = val
    void

# --- like lazy-scan but doesn't require initial value (assumes non-empty
# list).

lazy-scan1 = lazy-scanl1 = (f, lxs) -->*
    { value, done, } = lxs.next()
    yield value
    prev-val = value
    while true
        { value, done, } = lxs.next()
        break if done
        val = f.call null prev-val, value
        yield val
        prev-val = val
    void

# --- prelude's scanr and scanr1 reverse the substrate and the output list
# -- not implemented.

lazy-filter = (f, lxs) -->*
    while true
        { value, done, } = lxs.next()
        break if done
        yield value if f value
    void

lazy-reject = (f, lxs) -->*
    while true
        { value, done, } = lxs.next()
        break if done
        yield value unless f value
    void

lazy-partition = (f, lxs) -->*
    while true
        { value, done, } = lxs.next()
        break if done
        yield do
            value: value
            passed: if f value then true else false
    void

# --- n = numpassed + numrejected
#
# need better name XX
lazy-take-partitioned = (n, lxs) -->
    passed = []
    rejected = []
    for i from 0 to n - 1
        { value, done, } = lxs.next()
        return if done
        { value, passed: it-passed, } = value
        (if it-passed then passed else rejected).push value
    [passed, rejected]

# take-ok: take until not ok ?

# --- make the list finite.
#
# it will have a length of n or, if the generator is finite and shorter than
# n, then its length.
#
# if n is null/void then n is infinite.

lazy-take = (n = Infinity, lxs) -->
    ret = []
    for i from 0 to n - 1
        { value, done, } = lxs.next()
        return ret if done
        ret.push value
    ret

# --- returns lazy list (unlike lazy-take).
lazy-drop = (n, lxs) -->*
    for i from 0 to n - 1
        { value, done, } = lxs.next()
        break if done
    while true
        { value, done, } = lxs.next()
        break if done
        yield value
    void

# --- lazy-wake: synonym for take all.
#
# beware infinite.

lazy-wake = (lxs) -->
    lazy-take void lxs

# --- take until first null/undefined.
#
# beware infinite.

lazy-wake-ok = (lxs) -->
    ret = []
    while true
        { value, done, } = lxs.next()
        break if done or not value?
        ret.push value
    ret

# --- first yields the finite list lazy-take(n, lxs), or an empty list, then
# yields successive values of lxs.

lazy-split-at = (n, lxs) -->*
    yield lazy-take n, lxs
    ``yield* lxs;``
    void

lazy-take-while = (f, lxs) -->*
    while true
        { value, done, } = lxs.next()
        break if done
        return unless f value
        yield value
    void

lazy-drop-while = (f, lxs) -->*
    while true
        { value, done, } = lxs.next()
        break if done
        continue if f value
        yield value
    void

# we don't provide lazy-span (which is like (lazy-take-while,
# lazy-drop-while)), or lazy-break-list, because lazy-take-while will eat
# one value too many and it's too messy to try to 'unshift it back' to the
# generator.
#
# --- similar to split-at.
#
# first yields the finite list lazy-wake(lazy-take-while(f, lxs)), or an empty list. 
#
# the caller must be sure this list is finite.
#
# then yields successive values of lazy-drop-while(f, lxs).
#lazy-span = (f, lxs) -->*
#    yield lazy-wake lazy-take-while f, lxs
#    ``yield* lazyDropWhile(f, lxs);``

# --- first item which returns true, or undefined.
lazy-find = (f, lxs) -->
    while true
        { value, done, } = lxs.next()
        break if done
        return value if f value
    void

# --- returns undefined if empty.
lazy-head = (lxs) -->
    lxs.next().value

# --- unlike prelude, returns 'empty' generator on empty input, which wakes
# as [].
lazy-tail = (lxs) -->*
    return if lxs.next().done
    while true
        { value, done, } = lxs.next()
        break if done
        yield value
    void

# --- can be void.
lazy-last = (lxs) ->
    prev = void
    while true
        { value, done, } = lxs.next()
        return prev if done
        prev = value
    void

# --- void if empty or only one not ok element.
lazy-last-ok = (lxs) ->
    prev = void
    while true
        { value, done, } = lxs.next()
        # XXX
        break if done
        return prev if prev? and not value?
        prev = value
    void

# --- caller has to be sure it's finite.
lazy-reverse = (lxs) ->*
    for i in (lazy-wake lxs).reverse()
        yield i
    void

# --- caller has to be sure it's finite.
#
# dubitable value ... wake it up then make it lazy? XX
#
# returns list of x not y

lazy-unique-by = (f, lxs) -->*
    unique-func-vals = new Set
    unique-list-vals = []
    while true
        { value, done, } = lxs.next()
        func-value = f value
        break if done
        continue if unique-func-vals.has func-value
        unique-func-vals.add func-value
        unique-list-vals.push value
    for i in unique-list-vals
        yield i
    void


# routes through unique-by. slower etc XX
#
# functiorator

lazy-unique = (lxs) ->
    lazy-unique-by do
        -> it
        lxs

lazy-truncate = (n, lxs) -->*
    for i from 0 to n - 1
        { value, done, } = lxs.next()
        return if done
        yield value
    void

# --- second endpoint non-inclusive (like js slice).
lazy-slice = (a, b, lxs) -->*
    for i from 0 to b - 1
        { value, done, } = lxs.next()
        break if done
        continue unless i >= a
        yield value
    void
# ------ all fold variants need a finite list.

lazy-fold = lazy-foldl = (f, initial, lxs) -->
    result = initial
    while true
        { value, done, } = lxs.next()
        break if done
        result = f result, value
    result

# --- void on empty list, and doesn't require initial value.
lazy-fold1 = lazy-foldl1 = (f, lxs) -->
    { value, done, } = lxs.next()
    result = value
    return result if done
    while true
        { value, done, } = lxs.next()
        break if done
        result = f result, value
    result

lazy-foldr = (f, initial, lxs) -->
    result = initial
    rlxs = lazy-reverse lxs
    while true
        { value, done, } = rlxs.next()
        break if done
        result = f result, value
    result

lazy-foldr1 = (f, lxs) -->
    rlxs = lazy-reverse lxs
    { value, done, } = rlxs.next()
    result = value
    return result if done
    while true
        { value, done, } = rlxs.next()
        break if done
        result = f result, value
    result

# --- takes array of lazy lists.
lazy-concat = (lxss) ->*
    for lxs in lxss
        while true
            { value, done, } = lxs.next()
            break if done
            yield value
    void

# not in prelude.
lazy-concat-to = (lxs-left, lxs-right) -->
    lazy-concat [lxs-left, lxs-right]

# name changed from prelude (concat-map)
#
# the map function returns lazy lists and they end up flattened.
lazy-map-concat = (f, lxs) -->*
    mxs = lazy-map f, lxs
    while true
        { value, done, } = mxs.next()
        break if done
        while true
            { value: value-inner, done: done-inner, } = value.next()
            break if done-inner
            yield value-inner
    void

lazy-flatten = (lxs) ->*
    while true
        { value, done, } = lxs.next()
        return if done

        # --- assume it's a generator if it has a .next method.
        #
        # will fail if it's a normal object which happens to have it though
        # XXX

        if (next-func = value.next) and is-function next-func
            # --- livescript doesn't support yield* ? XXX
            #yield* lazy-flatten value
            ``yield* lazyFlatten(value);``
        else
            yield value
    void

# --- preserves order.
#
# could also route through lazy-filter? XX
lazy-mask = lazy-difference = (mask-ary, lxs) -->*
    mask-set = new Set mask-ary
    while true
        { value, done, } = lxs.next()
        break if done
        continue if mask-set.has value
        # wrong XX
        #mask-set.add value
        yield value
    void

# --- preserves order.
lazy-intersect = (intersect-vals, lxs) -->*
    intersect-set = new Set intersect-vals
    while true
        { value, done, } = lxs.next()
        break if done
        continue unless intersect-set.has value
        yield value
    void

# no union.

# count by, group by: not really necessary (just wake use prelude).
# however, ours uses maps.

# --- returns Map.
lazy-count-by = (f, lxs) -->
    counts = new Map
    while true
        { value, done, } = lxs.next()
        break if done
        result = f value
        if (cnt = counts.get result)
            counts.set result, cnt + 1
        else
            counts.set result, 1
    counts

# --- returns Map.
lazy-group-by = (f, lxs) -->
    groups = new Map
    while true
        { value, done, } = lxs.next()
        break if done
        result = f value
        if (list = groups.get result)
            list.push value
        else
            groups.set result, [value]
    groups

# and-list, or-list: more efficient than waking and sending through prelude.

# false if anything falsey. true on empty list.
lazy-and-list = (lxs) ->
    while true
        { value, done, } = lxs.next()
        break if done
        return false unless value
    true

# true if anything is truthy. false on empty list.
lazy-or-list = (lxs) ->
    while true
        { value, done, } = lxs.next()
        break if done
        return true if value
    false

# any and all: ditto (more efficient).

lazy-any = (f, lxs) -->
    while true
        { value, done, } = lxs.next()
        break if done
        return true if f value
    false

# different than pls: returns false if any f(x) is false.
# so true on empty.
lazy-all = (f, lxs) -->
    while true
        { value, done, } = lxs.next()
        break if done
        return false unless f value
    true

lazy-mean = (lxs) -->
    sum = 0
    count = 0
    while true
        { value, done, } = lxs.next()
        break if done
        count += 1
        sum += value
    if count then sum / count else void

lazy-maximum = (lxs) -->
    cur = void
    while true
        { value, done, } = lxs.next()
        break if done
        if not cur? or value > cur
            cur = value
    cur

lazy-minimum = (lxs) -->
    cur = void
    while true
        { value, done, } = lxs.next()
        break if done
        if not cur? or value < cur
            cur = value
    cur

lazy-maximum-by = (f, lxs) -->
    cur = void
    while true
        { value, done, } = lxs.next()
        break if done
        result = f value
        if not cur? or result > cur
            cur = result
    cur

lazy-minimum-by = (f, lxs) -->
    cur = void
    while true
        { value, done, } = lxs.next()
        break if done
        result = f value
        if not cur? or result < cur
            cur = result
    cur

# sort-xxx, not necessary.

# --- 0 on empty.
lazy-sum = (lxs) ->
    lazy-fold (+), 0, lxs

# --- 1 on empty.
lazy-product = (lxs) ->
    lazy-fold (*), 1, lxs

# ------ zip: using a -two variant to be the zip of prelude, and our zip si
# their zip-all.

# --- [1 2 3 ...] [4 5 6 ...] [...] => [1 4 ...] [2 5 ...] [3 6 ...] ...
#
# stop zipping when any of them is finished, thus they don't have to be
# the same size.

lazy-zip = (...lxss) ->*
    :outer while true
        vals = []
        for lxs in lxss
            { value, done, } = lxs.next()
            break outer if done
            vals.push value
        yield vals
    void

# --- f, [1 2 3 ...], [4 5 6 ...] => (f 1 4), (f 2 5), (f 3 6), ...
#
# stop zipping when either of them is finished, thus they don't have to be
# the same size.

lazy-zip-with = (f, ...lxss) ->*
    :outer while true
        vals = []
        for lxs in lxss
            { value, done, } = lxs.next()
            break outer if done
            vals.push value
        yield f.apply null vals
    void

# ------ -two variants are curried.
lazy-zip-two = (lxs, rxs) -->
    lazy-zip.call null lxs, rxs

lazy-zip-two-with = (f, lxs, rxs) -->
    lazy-zip-with.call null f, lxs, rxs

# --- undefined if invalid.
lazy-at = lazy-pick = (n, lxs) -->
    for i from 0 to n - 1
        { value, done, } = lxs.next()
        break if done
    { value, done, } = lxs.next()
    value

# --- all the indices which match this element.
#
# expects finite.

lazy-elem-indices = (el, lxs) -->
    idx = -1
    while true
        idx = idx + 1
        { value, done, } = lxs.next()
        break if done
        continue unless value == el
        idx

lazy-elem-index = (el, lxs) -->
    lazy-elem-indices ...
        .shift()

# --- all the indices for which the function is true.
#
# expects finite.

lazy-find-indices = (f, lxs) -->
    idx = -1
    while true
        idx = idx + 1
        { value, done, } = lxs.next()
        break if done
        continue unless f value
        idx

lazy-find-index = (f, lxs) -->
    lazy-find-indices ...
        .shift()

#lazy-zip = ->
#lazy-zip-with = ->

export
    lazy-map
    lazy-range
    lazy-take
    lazy-drop
    lazy-wake
    lazy-wake-ok
    lazy-split-at
    lazy-take-while
    lazy-drop-while
    lazy-compact
    lazy-compact-ok
    lazy-list-empty
    lazy-list
    lazy-list-ok
    lazy-scan
    lazy-scanl
    lazy-scan1
    lazy-scanl1
    lazy-filter
    lazy-reject
    lazy-partition
    lazy-take-partitioned
    lazy-find
    lazy-head
    lazy-tail
    lazy-last
    lazy-last-ok
    lazy-reverse
    lazy-concat
    lazy-concat-to
    lazy-fold
    lazy-foldl
    lazy-fold1
    lazy-foldl1
    lazy-foldr
    lazy-foldr1
    lazy-truncate
    lazy-slice
    lazy-unique
    lazy-unique-by
    lazy-concat
    lazy-concat-to
    lazy-map-concat
    lazy-flatten
    lazy-mask
    lazy-difference
    lazy-intersect
    lazy-count-by
    lazy-group-by
    lazy-and-list
    lazy-or-list
    lazy-any
    lazy-all
    lazy-sum
    lazy-product
    lazy-mean
    lazy-maximum
    lazy-minimum
    lazy-maximum-by
    lazy-minimum-by
    lazy-zip
    lazy-zip-with
    lazy-zip-two
    lazy-zip-two-with
    lazy-at
    lazy-pick
    lazy-elem-index
    lazy-elem-indices
    lazy-find-index
    lazy-find-indices




# remove not documented in prelude.
#lazy-remove = 
#remove = (el, xs) -->
#  i = elem-index el, xs
#  xs.slice!
#    ..splice i, 1 if i?

# --- not implemented -- doesn't seem that useful. (all but the last one)
#lazy-initial = (lxs) ->*

