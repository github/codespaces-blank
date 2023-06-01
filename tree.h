#ifndef INCLUDE_TREE_H_
#define INCLUDE_TREE_H_
#include  <iostream>
#include  <fstream>
#include  <cstdlib>
#include <vector>

using namespace std;

struct Node{
char c;
std::vector<Node*> v;
};
int factorial(int number) {
	int F = 1;
	for (int i = 1; i <= number; i++)
		F = F * i;
	return F / number;
}
class Tree {
 private:
   
   int count=0;	
 public:
  std::vector<char> base;
  std::vector<Node*> enter;
  std::vector<char> var;
  Tree(std::vector<char> in) {
    base = in;
	var=std::vector<char>(base.size());
	int varsize=var.size();
	enter = std::vector<Node*>(base.size());
		
  }

  bool MakeTree(std::vector<Node*> *v, int del_i, std::vector<char> base, int numbervar){
	  if (base.size() == 1) {
		cout << endl;
		if(++count==numbervar)
		  return true;
		return false;
	  }
	  std::vector<char> ch(base);
	  if (del_i>=0)
		ch.erase(ch.begin() + del_i);
	  int len = ch.size();
	  for (int i = 0; i < len; i++) {
		  (*v)[i] = new Node{ ch[i],std::vector<Node*>(len - 1) };
		  cout << ch[i];
		  var[varsize-len]=ch[i];
		  if(MakeTree(&((*v)[i]->v), i, ch)) return true;
	  }
		  return false;
  }	
};
#endif  // INCLUDE_TREE_H_

//вариант 1 полное построение дерева
/* bool MakeTree(std::vector<Node*> *v, int del_i, std::vector<char> base){
	  if (base.size() == 1) {
		cout << endl;
		return true;
	  }
	  std::vector<char> ch(base);
	  if (del_i>=0)
		ch.erase(ch.begin() + del_i);
	  int len = ch.size();
	  for (int i = 0; i < len; i++) {
		  (*v)[i] = new Node{ ch[i],std::vector<Node*>(len - 1) };
		  cout << ch[i];
		  MakeTree(&((*v)[i]->v), i, ch);
	  }
		  return true;
  }*/
