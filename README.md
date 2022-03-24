Given an evergreen patch id, download and group failures info by test name 🌲

#### Usage
```javascript
nodejs evg_get_failing_tests.js --patch_id <patch_id>
```

For example: `nodejs evg_get_failing_tests.js --patch_id 623ca7391e2d176c5d5653d1`

#### Output example
```shell
nodejs evg_get_failing_tests.js --patch_id 623ca7391e2d176c5d5653d1
Processing failing tasks: 1/12 ...
Processing failing tasks: 2/12 ...
Processing failing tasks: 3/12 ...
Processing failing tasks: 4/12 ...
Processing failing tasks: 5/12 ...
Processing failing tasks: 6/12 ...
Processing failing tasks: 7/12 ...
Processing failing tasks: 8/12 ...
Processing failing tasks: 9/12 ...
Processing failing tasks: 10/12 ...
Processing failing tasks: 11/12 ...
Processing failing tasks: 12/12 ...

===========

--- Test: jstests/parallel/basicPlus.js
--- Failed in 2 variants/suites:
- mongodb_mongo_master_enterprise_rhel_80_64_bit_dynamic_all_feature_flags_required_parallel_0_enterprise_rhel_80_64_bit_dynamic_all_feature_flags_required_patch_3c6e77a4a23df74b746653c3cd1ef9da67e7f9fa_623ca7391e2d176c5d5653d1_22_03_24_17_15_52
- mongodb_mongo_master_enterprise_rhel_80_64_bit_dynamic_all_feature_flags_required_display_parallel_patch_3c6e77a4a23df74b746653c3cd1ef9da67e7f9fa_623ca7391e2d176c5d5653d1_22_03_24_17_15_52


--- Test: jstests/sharding/resharding_update_shard_key_in_retryable_write.js
--- Failed in 2 variants/suites:
- mongodb_mongo_master_enterprise_rhel_80_64_bit_dynamic_all_feature_flags_required_sharding_max_mirroring_0_enterprise_rhel_80_64_bit_dynamic_all_feature_flags_required_patch_3c6e77a4a23df74b746653c3cd1ef9da67e7f9fa_623ca7391e2d176c5d5653d1_22_03_24_17_15_52
- mongodb_mongo_master_enterprise_rhel_80_64_bit_dynamic_all_feature_flags_required_display_sharding_max_mirroring_patch_3c6e77a4a23df74b746653c3cd1ef9da67e7f9fa_623ca7391e2d176c5d5653d1_22_03_24_17_15_52


--- Test: jstests/replsets/buildindexes_false_commit_quorum.js
--- Failed in 1 variants/suites:
- mongodb_mongo_master_enterprise_rhel_80_64_bit_dynamic_required_replica_sets_multiversion_last_continuous_3_enterprise_rhel_80_64_bit_dynamic_required_patch_3c6e77a4a23df74b746653c3cd1ef9da67e7f9fa_623ca7391e2d176c5d5653d1_22_03_24_17_15_52
```
