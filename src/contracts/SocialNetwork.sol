pragma solidity >=0.5.0 ;

contract SocialNetwork{
  
  string public name;
  
  uint public postCount = 0 ;

  mapping (uint => Post) public posts;
  

struct Post {
  uint id ;
  string content ;
  uint tipAmount ;
  address payable author ;
  
  
}

event PostCreated(
  uint id ,
  string content, 
  uint tipAmount ,
  address payable author 
  );




event PostTipped(
  uint id ,
  string content, 
  uint tipAmount ,
  address payable author 
  );

  constructor() public {

  
    name = "Nikhil Blockchain Hello World";

  }

  function createPost(string memory _content) public {
    
    //validating the valid content
    require(bytes(_content).length > 0);
     
    postCount++; 

    //create post
    
    posts[postCount] = Post(postCount,_content,0,msg.sender);
    
     emit PostCreated(postCount,_content,0,msg.sender);  
   

  }

  function tipPost(uint _id ) public payable {
   
   //validating the valid post id
    require(_id > 0 && _id  <= postCount);
    
 
   //fetch the post 

    Post memory _post = posts[_id];

   //fetch the author
   
   address payable _author = _post.author ;

   // pay the author sendign them Ehterum
   
    address(_author).transfer(msg.value); 

   //incrent the tip  amount

   _post.tipAmount =_post.tipAmount + msg.value ;

   //update the post
     
    posts[_id]= _post;

   //trigger the event
   emit PostTipped(postCount, _post.content, _post.tipAmount, _author);
    

  }


}