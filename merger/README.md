# Technical documentation

This operator is designed to concatenate JSON arrays received over input endpoints. Since data is being received
asynchronously, it works this way:

* The operator initializes a buffer for each input endpoint with an empty array.
* *Every* time anything is received over either input endpoint A or B, the internal buffers of A and B are concatenated
  in the order (a1, a2, a3, ..., an, b1, b2, b3, ..., bn) and sent through the output endpoint of this operator.