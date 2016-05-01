#include <iostream>
using namespace std;

long long fac(unsigned int x) {
  long long res = 1;
  if (x > 1) {
    res = x * fac(x - 1);
  }
  return res;
}

int main() {
  unsigned int x = 5;
  cout<<"factorial of "<<x<<" = "<<fac(5)<<endl;
  return 0;
}