/*
 * @lc app=leetcode id=206 lang=java
 *
 * [206] Reverse Linked List
 *
 * https://leetcode.com/problems/reverse-linked-list/description/
 *
 * algorithms
 * Easy (52.60%)
 * Total Accepted:    514.6K
 * Total Submissions: 977.4K
 * Testcase Example:  '[1,2,3,4,5]'
 *
 * Reverse a singly linked list.
 * 
 * Example:
 * 
 * 
 * Input: 1->2->3->4->5->NULL
 * Output: 5->4->3->2->1->NULL
 * 
 * 
 * Follow up:
 * 
 * A linked list can be reversed either iteratively or recursively. Could you
 * implement both?
 * 
 */
/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) { val = x; }
 * }
 */

 /** Iterative **/
class Solution {
    public ListNode reverseList(ListNode head) {
        if (head == null || head.next == null) {
            return head;
        }
        ListNode prev = null;
        ListNode next = null;
        ListNode currentNode = head;
        while (currentNode != null) {
            next = currentNode.next;
            currentNode.next = prev;
            prev = currentNode;
            currentNode = next;
        }
        return prev;
    }
}

// https://leetcode.com/explore/learn/card/recursion-i/251/scenario-i-recurrence-relation/2379/
/**
 * The recursive version is slightly trickier and the key is to work backwards. Assume that the rest of the list had already been reversed, now how do I reverse the front part? Let's assume the list is: n1 → … → nk-1 → nk → nk+1 → … → nm → Ø

Assume from node nk+1 to nm had been reversed and you are at node nk.

n1 → … → nk-1 → nk → nk+1 ← … ← nm

We want nk+1’s next node to point to nk.

So,

nk.next.next = nk;

Be very careful that n1's next must point to Ø. If you forget about this, your linked list has a cycle in it. This bug could be caught if you test your code with a linked list of size 2.

当前的node就是head 
Recursion Function就是一个break point. 
在Recursion Function上面的操作是进入下一层之前要执行的操作
在Recursion Function下面的操作是返回上一层后要执行的操作
*/
/* Recrusive */
class Solution {
    public ListNode reverseList(ListNode head) {
        // 进入下一层之前要执行的操作
        if (head == null || head.next == null) {
            return head;
        }
        ListNode newHead = reverseList(head.next);  // break point
        // 返回上一层之后要执行的操作
        head.next.next = head;
        head.next = null;
        return newHead;
    }
}
