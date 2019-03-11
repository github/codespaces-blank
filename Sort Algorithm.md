### Description ###
Given an array of integers, sort the elements in the array in ascending order. The insertion sort algorithm should be used to solve this problem.

Examples
```
{1, 2, 3} is sorted to {1, 2, 3}
{4, 2, -3, 6, 1} is sorted to {-3, 1, 2, 4, 6}
```
Corner Cases

What if the given array is null? In this case, we do not need to do anything.  
What if the given array is of length zero? In this case, we do not need to do anything.

---
### Insertion Sort ###
https://itimetraveler.github.io/2017/07/18/%E5%85%AB%E5%A4%A7%E6%8E%92%E5%BA%8F%E7%AE%97%E6%B3%95%E6%80%BB%E7%BB%93%E4%B8%8Ejava%E5%AE%9E%E7%8E%B0/

直接插入排序的基本思想是：将数组中的所有元素依次跟前面已经排好的元素相比较，如果选择的元素比已排序的元素小，则交换，直到全部元素都比较过为止。  
![](https://itimetraveler.github.io/gallery/sort-algorithms/Insertion-sort-example-300px.gif)  
![](https://itimetraveler.github.io/gallery/sort-algorithms/insert-sort.gif)  
O(n^2) runtime, O(1) space
```java
public class Solution {
  public int[] sort(int[] array) {
    if (array == null || array.length == 0) {
      return array;
    }
    
    // start from 1, check with prev element, if prev > current, swap
    // check till prev reach 0
    for (int i = 1; i < array.length; i++) {
      int prev = i - 1;
      int current = array[i];
      while (prev >= 0 && array[prev] > current) {
        array[prev + 1] = array[prev]; 
        array[prev] = current;
        prev--;
      }
    }
    
    return array;
  }
}
```
---
### Selection Sort ###
选择排序的基本思想：比较 + 交换。

在未排序序列中找到最小（大）元素，存放到未排序序列的起始位置。在所有的完全依靠交换去移动元素的排序方法中，选择排序属于非常好的一种。  
![](https://itimetraveler.github.io/gallery/sort-algorithms/Selection-Sort-Animation.gif)  
O(n^2) runtime, O(1) space
```java
public class Solution {
  public int[] solve(int[] array) {
    if (array == null || array.length == 0) {
      return array;
    }
    
    for (int i = 0; i < array.length; i++) {
      int minIndex = i;
      for (int j = i + 1; j < array.length; j++) {
        if (array[j] < array[minIndex]) {
          minIndex = j;
        }
      }
      swap(array, i, minIndex);
    }
    return array;
  }
  
  private void swap(int[] array, int left, int right) {
    int temp = array[left];
    array[left] = array[right];
    array[right] = temp;
  }
}
```
---
### Merge Sort ###
归并排序算法是将两个（或两个以上）有序表合并成一个新的有序表，即把待排序序列分为若干个子序列，每个子序列是有序的。然后再把有序子序列合并为整体有序序列。  
![](https://itimetraveler.github.io/gallery/sort-algorithms/2016-07-15_%E5%BD%92%E5%B9%B6%E6%8E%92%E5%BA%8F.gif)  
![](https://itimetraveler.github.io/gallery/sort-algorithms/merging-sort.gif)  
O(nlogn) runtime, O(n) space
```java
public class Solution {
  public int[] mergeSort(int[] array) {
    if (array == null || array.length == 0) {
      return array;
    }
    
    int[] solution = new int[array.length];
    mergeSort(array, solution, 0, array.length - 1);
    return array;
  }
  
  private void mergeSort(int[] array, int[] solution, int left, int right) {
    if (left == right) {
      return;
    }
    int mid = left + (right - left) / 2;
    mergeSort(array, solution, left, mid);
    mergeSort(array, solution, mid + 1, right);
    merge(array, solution, left, mid, right);
  }
  
  private void merge(int[] array, int[] solution, int left, int mid, int right) {
    // copy the content to solution array and we will merge from the solution array
    for (int i = left; i <= right; i++) {
      solution[i] = array[i];
    }
    int leftIndex = left;
    int rightIndex = mid + 1;
    while (leftIndex <= mid && rightIndex <= right) {
      if (solution[leftIndex] <= solution[rightIndex]) {
        array[left++] = solution[leftIndex++];
      } else {
        array[left++] = solution[rightIndex++];  // move right bigger elment to correct position
      }
    }
    // if we still have some elements at left side, we need to copy them
    while (leftIndex <= mid) {
      array[left++] = solution[leftIndex++];
    }
    // if there are some elements at right side, we do not need to copy them
    // because they are already in their position
  }
}
```
---
### Quick Sort ###
首先选一个轴值(pivot，也有叫基准的)，通过一趟排序将待排记录分隔成独立的两部分，其中一部分记录的关键字均比另一部分的关键字小，则可分别对这两部分记录继续进行排序，以达到整个序列有序。
![](https://itimetraveler.github.io/gallery/sort-algorithms/Sorting_quicksort_anim.gif)  
![](https://itimetraveler.github.io/gallery/sort-algorithms/quick-sort09.gif)    
O(nlogn) runtime, O(1) space
```java
public class Solution {
  public int[] quickSort(int[] array) {
    if (array == null || array.length == 0) {
      return array;
    }
    quickSort(array, 0, array.length - 1);
    return array;
  }
  
  private void quickSort(int[] array, int left, int right) {
    if (left >= right) {
      return;
    }
    int pivotPos = partition(array, left, right);
    quickSort(array, left, pivotPos - 1);
    quickSort(array, pivotPos + 1, right);
  }
  
  private int partition(int[] array, int left, int right) {
    int pivotIndex = pivotIndex(left, right);
    int pivot = array[pivotIndex];
    // swap the pivot element to the rightmost position first
    swap(array, pivotIndex, right);
    int leftBound = left;
    int rightBound = right - 1;
    while (leftBound <= rightBound) {
       if (array[leftBound] < pivot) {
         leftBound++;
       } else if (array[rightBound] >= pivot) {
         rightBound--;
       } else {
         swap(array, leftBound++, rightBound--);
       }
    }
    // swap back the pivot element
    swap(array, leftBound, right);
    return leftBound;
  }
  
  // this is one of the ways defining the pivot,
  // pick random element in the range of [left, right];
  private int pivotIndex(int left, int right) {
    return left + (int)(Math.random() * (right - left + 1)); 
  }
  
  private void swap(int[] array, int left, int right) {
    int temp = array[left];
    array[left] = array[right];
    array[right] = temp;
  }
}
```