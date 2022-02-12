const SocialNetwork = artifacts.require('./SocialNetwork.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

  contract('SocialNetwork',([deployer,author,tipper]) =>{
    let socialNetwork;


  describe('deployment', async () => {

    before(async () =>{
     socialNetwork = await SocialNetwork.deployed();
     
    })


   it('deploys successfully ', async () => {
     const address = await socialNetwork.address;
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)

   })

   it('has name ', async () => {

     const name = await socialNetwork.name();

      assert.equal(name, 'Nikhil Blockchain Hello World')
      
      
   })
})


    
  describe('post', async () => {
     let result;
     let postCount;

  before(async () =>{
      result = await socialNetwork.createPost('This nikhil first post in blockchain network', { from: author })
      postCount = await socialNetwork.postCount()
     
    })

    it('create posts' , async () => {

      assert.equal(postCount, 1)
      const event = result.logs[0].args
      //console.log(event.content)
      assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
      assert.equal(event.content, 'This nikhil first post in blockchain network', 'content is correct')
      assert.equal(event.tipAmount, '0', 'tip amount is correct')
      assert.equal(event.author, author, 'author is correct')

        // FAILURE: Post must have content
      await socialNetwork.createPost('', { from: author }).should.be.rejected;
      })


    it('lists the posts', async () => { 
      const post = await socialNetwork.posts(postCount);
      
      //console.log(post);

      assert.equal(post.id.toNumber(), postCount.toNumber(), 'id is correct')
      assert.equal(post.content, 'This nikhil first post in blockchain network', 'content is correct')
      assert.equal(post.tipAmount, '0', 'tip amount is correct')
      assert.equal(post.author, author, 'author is correct')

    })

    it('allow user to tip the post', async () => {

        // Track the author balance before purchase
      let oldAuthorBalance
      oldAuthorBalance = await web3.eth.getBalance(author)
      oldAuthorBalance = new web3.utils.BN(oldAuthorBalance)

      result = await socialNetwork.tipPost(postCount, { from: tipper, value: web3.utils.toWei('1', 'Ether') })
      
       
      // SUCESS
      const event = result.logs[0].args
      console.log(event)
      console.log(event.tipAmount);
      assert.equal(event.id.toNumber(), postCount.toNumber(), 'id is correct')
      assert.equal(event.content, 'This nikhil first post in blockchain network', 'content is correct')
      assert.equal(event.tipAmount, '1000000000000000000', 'tip amount is correct')
      assert.equal(event.author, author, 'author is correct')
   
      // Check that author received funds
      let newAuthorBalance
      newAuthorBalance = await web3.eth.getBalance(author)
      newAuthorBalance = new web3.utils.BN(newAuthorBalance)

      let tipAmount
      tipAmount = web3.utils.toWei('1', 'Ether')
      tipAmount = new web3.utils.BN(tipAmount)


      const exepectedBalance = oldAuthorBalance.add(tipAmount)
      console.log(exepectedBalance)
      
      assert.equal(newAuthorBalance.toString(), exepectedBalance.toString())





    })

  })


  }) 