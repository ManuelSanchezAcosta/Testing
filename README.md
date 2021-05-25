# Front End User Facing RESTFull API
[https://demos.sistenet.mx/app/category-system/api/controllers/testing.php](https://demos.sistenet.mx/app/category-system/api/controllers/testing.php)

## GET : View all Categories
```JSON
{ "action": "getall" }
```

## GET : View All with Actives status 
```JSON
{ "action": "actives" }
```

## GET : View All with Inactives status
```JSON
{ "action": "inactives" }
```

## GET : View Count All
```JSON
{ "action": "countall" }
```
    
## GET : View One Item
```JSON
{ "action": "one", "id" : "1" }	
```

## POST : Create new Category
```JSON
 { "name": "type_name_here", "categoryid": 1, "storeid": 1, "action": "add" }
 ```

## POST : Edit Category
```JSON
 { "name": "type_name_here", "categoryid": 1, "storeid": 1, "id": 1, "action": "edit" }
 ```

## POST : Soft Delete (change status)
```JSON
 { "id": 21, "status": 1, "action": "editstatus" }
 ```

## DELETE : Hard Delete
```JSON
TE { "id": 49 }
```


## License
[MIT](https://choosealicense.com/licenses/mit/)