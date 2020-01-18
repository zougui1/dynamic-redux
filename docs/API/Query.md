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
