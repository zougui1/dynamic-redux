# Query

**type:** Class

**description:** A class allowing you to perform complex action on objects and arrays

> note: the query action isn't directly the class but is in fact a function that takes a callback that is given the query which must **ALWAYS** return the query

```js
myQueryAction(query => query
  .get('array')
  .push('new value')
);
```

Methods:

## at

**return:** Query

**description:** will return a `Query` querying on the value at the given `index` in the array currently being querried

Parameters:

| name  | type   | required  | description                           |
|-------|--------|-----------|---------------------------------------|
| index | number | true      | index to pick from the array property |

**example:**

```js
queryAction(q => q.at(5));
```

## concat

**return:** *this*

**description:** will concatenate the currently querried value with the given `...items`

Parameters:

| name     | type    | required  | description                                |
|----------|---------|-----------|--------------------------------------------|
| ...items | Array[] | true      | arrays with which to concatenate the value |

| name     | type         | required  | description                                    |
|----------|--------------|-----------|------------------------------------------------|
| ...items | Function[][] | true      | returned values from the arrays to concatenate |

**example:**

```js
queryAction(q => q.concat([0, 1, 2, 3, 4], [5, 6], [7], [8, 9]));
```

## filter

**return:** *this*

**description:** will filter the currently querried value depending on the parameters

Parameters:

| name      | type    | required  | description                                |
|-----------|---------|-----------|--------------------------------------------|
| predicate | string  | true      | the path of the property to test           |
| testValue | any     | true      | the value to test                          |

| name      | type    | required  | description                                |
|-----------|---------|-----------|--------------------------------------------|
| predicate | number  | true      | the index to keep in the array             |

| name      | type     | required  | description                                |
|-----------|----------|-----------|--------------------------------------------|
| predicate | function | true      | The function invoked per iteration         |

**example:**

```js
queryAction(q => q.filter('myProperty', 'myValue'));

queryAction(q => q.filter(5));

queryAction(q => q.filter((value, index, source) => value.myProperty === 'myValue' || index === 5));
```

## find

**return:** Query

**description:** find a value within the array of the currently querried value

**throws:** Will throw an error if the method find nothing and there is no `defaultValue` defined

Parameters:

| name         | type    | required  | description                                    |
|--------------|---------|-----------|------------------------------------------------|
| predicate    | string  | true      | the path of the items of the array to test      |
| testValue    | any     | true      | the value to test                              |
| defaultValue | any     | false     | Default value in case the method find nothing  |

| name         | type     | required  | description                                    |
|--------------|----------|-----------|------------------------------------------------|
| predicate    | function | true      | The function invoked per iteration             |
| testValue    | null     | false     | unused                                         |
| defaultValue | any      | false     | Default value in case the method find nothing  |

**example:**

```js
queryAction(q => q.find('myProperty', 'myValue', 'default value'));

queryAction(q => q.find((value, index, source) => value.myProperty === 'myValue' || index === 5));
```

## get

**return:** Query

**description:** get a `Query` querrying the value at the path of the object

Parameters:

| name  | type   | required  | description                           |
|-------|--------|-----------|---------------------------------------|
| path  | string | true      | The path of the property to query     |

**example:**

```js
queryAction(q => q.get('myProperty.deep'));
```

## group

**return:** *this*

**description:** group a separated query into a callback

Parameters:

| name      | type     | required  | description                                       |
|-----------|----------|-----------|---------------------------------------------------|
| callback  | function | true      | callback in which to perform an independent query |

**example:**

```js
queryAction(q => q
  .group(separatedQuery => separatedQuery.get('array').push('value'))
  .get('array').find(value => value ==='value')
);
```

## map

**return:** *this*

**description:** map the currently querried value with a `callback`

Parameters:

| name      | type     | required  | description                        |
|-----------|----------|-----------|------------------------------------|
| callback  | function | true      | the function invoked per iteration |

**example:**

```js
queryAction(q => q
  .map(value => value * 2) // multiply every value in the array by 2
);
```

## merge

**return:** *this*

**description:** merge the currently querried value with one or more `sources`

Parameters:

| name      | type     | required  | description                          |
|-----------|----------|-----------|--------------------------------------|
| ...sources| Object[] | true      | the sources to merge into the target |

**example:**

```js
queryAction(q => q
  .merge({ a: 'a' }, { foo: 'bar', a: 'b' })
);
```

## pop

**return:** *this*

**description:** remove the last value of the array

Parameters:

| name      | type     | required  | description                                                    |
|-----------|----------|-----------|----------------------------------------------------------------|
| callback  | function | false     | a function that has for parameter a query of the removed value |

**example:**

```js
queryAction(q => q
  .pop()
);
```

## pullAt

**return:** *this*

**description:** remove the values from the array at the given `indexes`

**note**: the actual array can be replaced by the removed values using [`returned`](https://github.com/zougui1/dynamic-redux/blob/master/docs/API/Query.md#returned)

Parameters:

| name     | type     | required | description                        |
|----------|----------|----------|------------------------------------|
| indexes  | number[] | true     | the indexes of the array to remove |

**example:**

```js
queryAction(q => q
  .pullAt([1, 5, 10])
);
```

## push

**return:** *this*

**description:** add a value at the end of the array

Parameters:

| name     | type  | required | description                |
|----------|-------|----------|----------------------------|
| ...items | Array | true     | values to add to the array |

| name     | type       | required | description                         |
|----------|------------|----------|-------------------------------------|
| ...items | Function[] | true     | returned values to add to the array |

**example:**

```js
queryAction(q => q
  .push(4, 5, 8)
);
```

## random

**return:** *this*

**description:** get a random value out of the array or string

**example:**

```js
queryAction(q => q
  .random()
);
```

## remove

**return:** *this*

**description:** remove elements using either a `predicate` or direct values

**note**: the actual array can be replaced by the removed values using [`returned`](https://github.com/zougui1/dynamic-redux/blob/master/docs/API/Query.md#returned) (only work for the first function signature)

Parameters:

| name      | type     | required | description                                                   |
|-----------|----------|----------|---------------------------------------------------------------|
| predicate | function | true     | function invoked per iteration                                |
| callback  | function | false    | function that has for parameter a query of the removed values |

| name      | type  | required | description                     |
|-----------|-------|----------|---------------------------------|
| predicate | Array | true     | values to remove from the array |

**example:**

```js
queryAction(q => q
  .remove(value => value % 2 === 0)
);

queryAction(q => q
  .remove([0, 1, 2, 3, 4, 5])
);
```

## repeat

**return:** *this*

**description:** repeat the last action or group of actions

**example:**

```js
queryAction(q => q
  .push(0)
  .repeat() // `0` gets pushed a second time
);

queryAction(q => q
  .group(subQuery => subQuery
    .push(5)
    .map(v => v * 2)
  )
  .repeat() // the whole `subQuery` gets called a second time
)
```

## returned

**return:** *this*

**description:** replace the value by a previously returned value

**example:**

```js
queryAction(q => q
  .pullAt(4, 5, 6)
  .returned() // set the actual array with `[4, 5, 6]`
);
```

## reverse

**return:** *this*

**description:** reverse the array

**example:**

```js
queryAction(q => q
  .reverse()
);
```

## set

**return:** *this*

**description:** set a value

Parameters:

| name  | type | required | description  |
|-------|------|----------|--------------|
| value | any  | true     | value to set |

| name  | type     | required | description           |
|-------|----------|----------|-----------------------|
| value | Function | true     | returned value to set |

**example:**

```js
queryAction(q => q
  .reverse()
);
```

## shift

**return:** *this*

**description:** remove the first value from the array

Parameters:

| name      | type     | required  | description                                                    |
|-----------|----------|-----------|----------------------------------------------------------------|
| callback  | function | false     | a function that has for parameter a query of the removed value |

**example:**

```js
queryAction(q => q
  .shift()
);
```

## slice

**return:** *this*

**description:** replace the array by a portion of said array selected from `begin` to `end` (`end` not included)

Parameters:

| name   | type   | required  | description                                                                             |
|--------|--------|-----------|-----------------------------------------------------------------------------------------|
| begin  | number | true      | index at which to begin extraction                                                      |
| end    | number | false     | index at which to end extraction, if not set the extraction will end at the last index (included) |

**example:**

```js
queryAction(q => q
  .slice(2, 5) // all values from third to fifth indexes (included)
);

queryAction(q => q
  .slice(2) // all values from the third index up to the last index (included)
);
```

## splice

**return:** *this*

**description:** changes the contents of an array by removing or replacing existing elements and/or adding new elements in place

**note**: the actual array can be replaced by the removed values using [`returned`](https://github.com/zougui1/dynamic-redux/blob/master/docs/API/Query.md#returned)

Parameters:

| name        | type   | required  | description                                                                       |
|-------------|--------|-----------|-----------------------------------------------------------------------------------|
| start       | number | true      | the index at which to start changing the array                                    |
| deleteCount | number | false     | Number of elements in the array to remove from `start`, if not set all the elemtns from `start` to the end of the array will be deleted |
| ...items    | *      | false     | the elements to add to the array, beginning from `start`                          |

**example:**

```js
queryAction(q => q
  .splice(2, 5) // remove all the values from third up to fifth indexes (included)
);

queryAction(q => q
  .splice(2) // remove all the values from the third index up to the end
);

queryAction(q => q
  .splice(2, 0, 'something') // add a value at the third index
);

queryAction(q => q
  .splice(2, 1, 'something') // replace the value at the third index
);
```

## uniq

**return:** *this*

**description:** remove all duplicates from the array

**example:**

```js
queryAction(q => q
  .uniq(2, 5)
);
```

## unshift

**return:** *this*

**description:** add one or more values at the beginning of the array

Parameters:

| name     | type  | required | description                |
|----------|-------|----------|----------------------------|
| ...items | Array | true     | values to add to the array |

| name     | type       | required | description                         |
|----------|------------|----------|-------------------------------------|
| ...items | Function[] | true     | returned values to add to the array |

**example:**

```js
queryAction(q => q
  .unshift(2, 5)
);
```
