/*
 * @lc app=leetcode id=24 lang=java
 *
 * [24] Swap Nodes in Pairs
 *
 * https://leetcode.com/problems/swap-nodes-in-pairs/description/
 *
 * algorithms
 * Medium (43.00%)
 * Total Accepted:    281.3K
 * Total Submissions: 652.2K
 * Testcase Example:  '[1,2,3,4]'
 *
 * Given a linked list, swap every two adjacent nodes and return its head.
 * 
 * You may not modify the values in the list's nodes, only nodes itself may be
 * changed.
 * 
 * 
 * 
 * Example:
 * 
 * 
 * Given 1->2->3->4, you should return the list as 2->1->4->3.
 * 
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
// class Solution {
//     public ListNode swapPairs(ListNode head) {
//         if (head == null || head.next == null) {
//             return head;
//         }
//         ListNode n = head.next;
//         head.next = swapPairs(head.next.next);
//         n.next = head;
//         return n;
//     }
// }

// class Solution {
//     public ListNode swapPairs(ListNode head) {
//         if (head == null || head.next == null) {
//             return head;
//         }
//         ListNode second = head.next;
//         ListNode third = second.next;
        
//         second.next = head;
//         head.next = swapPairs(third);

//         return second;
//     }
// }

// class Solution {
//     public ListNode swapPairs(ListNode head) {
//         ListNode dummy = new ListNode(0);
//         dummy.next = head;
//         ListNode current = dummy;
//         while (current.next != null && current.next.next != null) {
//             ListNode first = current.next;
//             ListNode second = current.next.next;

//             first.next = second.next;
//             current.next = second;
//             second.next = first;
            
//             current = first;
//         }
//         return dummy.next;
//     }
// }

class Solution {
    public ListNode swapPairs(ListNode head) {
        ListNode dummy = new ListNode(0);
        dummy.next = head;
        ListNode current = dummy;
        while (current.next != null && current.next.next != null) {
            ListNode first = current.next;
            ListNode second = current.next.next;

            // this one must be first. set first.next = null.
            // if you change second.next first, then You cannot set first.next to correct element
            first.next = second.next;
            // but for the following two, no matter what order they are.
            // you can change the order
            second.next = first;
            current.next = second;
            
            current = first;
        }
        return dummy.next;
    }
}

