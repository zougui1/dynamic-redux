# connect

**type:** Function

**return:** WrappedComponent

**description:** uses mapState and/or mapDispatch or QueryDispatch on the mappers if necessary and connect them with the component

Parameters:

| name              | type                                                                   | required | description        |
|-------------------|------------------------------------------------------------------------|----------|--------------------|
| mapStateToProps   | function \| string \| object.&lt;string, string \| string[]&gt; \| null| true     | map the properties from the Redux's store into the component's props |
| mapDispatchToProps|function \| string \| object.&lt;string, string \| string[]&gt; \| null| false   | map the actions from the states into the component's props |
