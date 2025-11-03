package db

import (
	"context"
	"errors"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

func ApplyMigrations(dir string) error {
	if Pool == nil {
		return errors.New("db not initialized")
	}
	entries, err := os.ReadDir(dir)
	if err != nil {
		return fmt.Errorf("read dir: %w", err)
	}
	var files []fs.DirEntry
	for _, e := range entries {
		if !e.IsDir() && strings.HasSuffix(e.Name(), ".sql") {
			files = append(files, e)
		}
	}
	sort.Slice(files, func(i, j int) bool { return files[i].Name() < files[j].Name() })

	for _, f := range files {
		path := filepath.Join(dir, f.Name())
		b, err := os.ReadFile(path)
		if err != nil {
			return fmt.Errorf("read file %s: %w", path, err)
		}
		ctx := context.Background()
		if _, err := Pool.Exec(ctx, string(b)); err != nil {
			return fmt.Errorf("exec %s: %w", f.Name(), err)
		}
		fmt.Printf("Applied migration: %s\n", f.Name())
	}
	return nil
}
