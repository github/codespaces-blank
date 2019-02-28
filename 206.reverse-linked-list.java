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
// class Solution {
//     public ListNode reverseList(ListNode head) {
//         if (head == null || head.next == null) {
//             return head;
//         }
//         ListNode prev = null;
//         ListNode next = null;
//         ListNode currentNode = head;
//         while (currentNode != null) {
//             next = currentNode.next;
//             currentNode.next = prev;
//             prev = currentNode;
//             currentNode = next;
//         }
//         return prev;
//     }
// }

/* Recrusive */
class Solution {
    public ListNode reverseList(ListNode head) {
        if (head == null || head.next == null) {
            return head;
        }
        ListNode newHead = reverseList(head.next);
        head.next.next = head;
        head.next = null;
        return newHead;
    }
}
