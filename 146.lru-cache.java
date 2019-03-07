import java.util.Hashtable;

/*
 * @lc app=leetcode id=146 lang=java
 *
 * [146] LRU Cache
 *
 * https://leetcode.com/problems/lru-cache/description/
 *
 * algorithms
 * Hard (23.82%)
 * Total Accepted:    258.3K
 * Total Submissions: 1.1M
 * Testcase Example:  '["LRUCache","put","put","get","put","get","put","get","get","get"]\n[[2],[1,1],[2,2],[1],[3,3],[2],[4,4],[1],[3],[4]]'
 *
 * 
 * Design and implement a data structure for Least Recently Used (LRU) cache.
 * It should support the following operations: get and put.
 * 
 * 
 * 
 * get(key) - Get the value (will always be positive) of the key if the key
 * exists in the cache, otherwise return -1.
 * put(key, value) - Set or insert the value if the key is not already present.
 * When the cache reached its capacity, it should invalidate the least recently
 * used item before inserting a new item.
 * 
 * 
 * Follow up:
 * Could you do both operations in O(1) time complexity?
 * 
 * Example:
 * 
 * LRUCache cache = new LRUCache( 2 /* capacity *
 * 
 * cache.put(1, 1);
 * cache.put(2, 2);
 * cache.get(1);       // returns 1
 * cache.put(3, 3);    // evicts key 2
 * cache.get(2);       // returns -1 (not found)
 * cache.put(4, 4);    // evicts key 1
 * cache.get(1);       // returns -1 (not found)
 * cache.get(3);       // returns 3
 * cache.get(4);       // returns 4
 * 
 * 
 */
public class LRUCache {

    class DLinkedNode {
      int key;
      int value;
      DLinkedNode pre;
      DLinkedNode post;
    }
    
    /**
     * Always add the new node right after head;
     */
    private void addNode(DLinkedNode node) {
        
      node.pre = head;
      node.post = head.post;
    
      head.post.pre = node;
      head.post = node;
    }
    
    /**
     * Remove an existing node from the linked list.
     */
    private void removeNode(DLinkedNode node){
      DLinkedNode pre = node.pre;
      DLinkedNode post = node.post;
    
      pre.post = post;
      post.pre = pre;
    }
    
    /**
     * Move certain node in between to the head.
     */
    private void moveToHead(DLinkedNode node){
      this.removeNode(node);
      this.addNode(node);
    }
    
    // pop the current tail. 
    private DLinkedNode popTail(){
      DLinkedNode res = tail.pre;
      this.removeNode(res);
      return res;
    }
    
    private Hashtable<Integer, DLinkedNode> 
      cache = new Hashtable<Integer, DLinkedNode>();
    private int count;
    private int capacity;
    private DLinkedNode head, tail;
    
    public LRUCache(int capacity) {
      this.count = 0;
      this.capacity = capacity;
    
      head = new DLinkedNode();
      head.pre = null;
    
      tail = new DLinkedNode();
      tail.post = null;
    
      head.post = tail;
      tail.pre = head;
    }
    
    public int get(int key) {
    
      DLinkedNode node = cache.get(key);
      if(node == null){
        return -1; // should raise exception here.
      }
    
      // move the accessed node to the head;
      this.moveToHead(node);
    
      return node.value;
    }
    
    
    public void put(int key, int value) {
      DLinkedNode node = cache.get(key);
    
      if(node == null){
    
        DLinkedNode newNode = new DLinkedNode();
        newNode.key = key;
        newNode.value = value;
    
        this.cache.put(key, newNode);
        this.addNode(newNode);
    
        ++count;
    
        if(count > capacity){
          // pop the tail
          DLinkedNode tail = this.popTail();
          this.cache.remove(tail.key);
          --count;
        }
      }else{
        // update the value.
        node.value = value;
        this.moveToHead(node);
      }
    }
    
    }
/**
 * Your LRUCache object will be instantiated and called as such:
 * LRUCache obj = new LRUCache(capacity);
 * int param_1 = obj.get(key);
 * obj.put(key,value);
 */
