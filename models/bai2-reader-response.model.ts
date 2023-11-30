interface IBAI2_READER_SUCCESS_RESPONSE<V> {
  error: null,
  value: V
}

interface IBAI2_READER_ERROR_RESPONSE {
  error: Error,
  value: null
}

export type IBAI2_READER_RESPONSE<T> = IBAI2_READER_SUCCESS_RESPONSE<T> | IBAI2_READER_ERROR_RESPONSE
