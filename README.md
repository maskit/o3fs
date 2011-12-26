O3FS: One and Only Online File System
===

O3FS is a kind of filesystem. It doesn't manage any files, only provides
one and only root directory and its sub-directories for mounting various
online storage such as Dropbox.

Why O3FS
---

On the UNIX system, all storage which we need to access is must be mounted to
the one big tree, rooted at '/'. So we can access the storage using absolute
path that starts with '/' (or somtimes using relative path).

On the other hand, online storage is completely independent each other. It
means, there are multiple small trees and we have to plant a big tree in our
own head to manage the trees. And unfortunately applications can't access this
big tree even with modern technology.

O3FS provides a one-rooted, application accessible big tree. It allows us to
move/copy files from one to another and applications would be able to use any
online storage as long as it supports O3FS.

Limitations
---

O3FS will limit some features that originally provided by online storage for
unified storage access. But if you really need the feature, you can also use
the storage directly.

FAQ
---
**Q:** How do you pronounce O3FS?  
**A:** It's Ozone-Filesystem, But you can call simply Oh-Three-Filesystem.