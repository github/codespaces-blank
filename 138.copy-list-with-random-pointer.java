import java.util.HashMap;

import jdk.nashorn.internal.ir.Node;

/*
 * @lc app=leetcode id=138 lang=java
 *
 * [138] Copy List with Random Pointer
 *
 * https://leetcode.com/problems/copy-list-with-random-pointer/description/
 *
 * algorithms
 * Medium (25.62%)
 * Total Accepted:    225K
 * Total Submissions: 871.4K
 * Testcase Example:  '{"$id":"1","next":{"$id":"2","next":null,"random":{"$ref":"2"},"val":2},"random":{"$ref":"2"},"val":1}'
 *
 * A linked list is given such that each node contains an additional random
 * pointer which could point to any node in the list or null.
 * 
 * Return a deep copy of the list.
 * 
 * 
 * 
 * Example 1:
 * 
 * 
 * 
 * 
 * Input:
 * 
 * {"$id":"1","next":{"$id":"2","next":null,"random":{"$ref":"2"},"val":2},"random":{"$ref":"2"},"val":1}
 * 
 * Explanation:
 * Node 1's value is 1, both of its next and random pointer points to Node 2.
 * Node 2's value is 2, its next pointer points to null and its random pointer
 * points to itself.
 * 
 * 
 * 
 * 
 * Note:
 * 
 * 
 * You must return the copy of the given head as a reference to the cloned
 * list.
 * 
 */
/*
// Definition for a Node.
class Node {
    public int val;
    public Node next;
    public Node random;

    public Node() {}

    public Node(int _val,Node _next,Node _random) {
        val = _val;
        next = _next;
        random = _random;
    }
};
*/


class Solution {
    public Node copyRandomList(Node head) {
        if (head == null) {
            return null;
        }
        // <Node, Node>: node in old list with next and random
        // new node only has value, no next or random pointers
        Map<Node, Node> map = new HashMap<>();

        // loop 1. copy all the nodes
        Node current = head;
        while (current != null) {
            map.put(current, new Node(current.val));
            current = current.next;
        }

        // loop 2. assign next and random pointers
        current = head;
        while (current != null) {
            map.get(current).next = map.get(current.next);
            map.get(current).random = map.get(current.random);
            current = current.next;
        }

        return map.get(head);
    }
}

class Solution {
    // HashMap which holds old nodes as keys and new nodes as its value
    HashMap<Node, Node> visitedHash = new HashMap<>();

    public Node copyRandomList(Node head) {
        if (head == null) {
            return null;
        }

        // If we have already processed the current node, then we simply return the cloned 
        // version of it.
        if (visitedHash.containsKey(head)) {
            return visitedHash.get(head);
        }

        // Create a new node with the value same as old node
        Node node = new Node(head.val, null, null);

        // Save the new node in the hashmap. This is needed since there might be loop during
        // traversal dur to randomness of random pointers and this would help us avoid them
        visitedHash.put(head, node);

        // Recursively copy the remaining linked list starting once from the next pointer and
        // then from the random pointer.
        // Thus we have two independent recursive calls.
        // Finally we update the next and random pointers for the new node created.
        node.next = copyRandomList(head.next);
        node.random = copyRandomList(head.random);
    }
}

